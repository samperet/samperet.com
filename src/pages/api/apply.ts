// Applications to the men's group (/mens-group/). Kept with Merlin's messages, so they show at
// /backend, and emailed to Sam with the applicant as the reply-to. The page posts multipart form
// data and asks for JSON, with the applicant's video when they recorded one; the video travels
// only as an attachment to that email. Without JavaScript the form posts itself and is sent back
// to the page, to its thank-you note.
import type { APIRoute } from 'astro';
import { db } from '../../lib/db';
import { canNotify, notify } from '../../lib/notify';
import { allow, clip, deviceOf, geoOf, sameOrigin } from '../../lib/visitor';

export const prerender = false;

const PAGE = '/mens-group/';
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Vercel refuses request bodies over 4.5 MB; the page keeps a minute's video well under this.
const VIDEO_MAX = 4_400_000;

const slug = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'applicant';

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const type = request.headers.get('content-type') ?? '';
  const wantsJson = type.includes('application/json') || (request.headers.get('accept') ?? '').includes('application/json');
  const reply = (status: number, error?: string) =>
    wantsJson
      ? new Response(JSON.stringify(error ? { ok: false, error } : { ok: true }), {
          status,
          headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
        })
      : new Response(null, { status: 303, headers: { Location: `${PAGE}#${error ? 'apply-failed' : 'applied'}` } });

  if (!sameOrigin(request)) return reply(403, 'Not allowed.');
  if (!allow(`apply:${clientAddress}`, 3, 10 * 60_000)) return reply(429, 'Too many applications. Try again later.');

  let body: Record<string, unknown>;
  try {
    body = type.includes('application/json') ? JSON.parse(await request.text()) : Object.fromEntries(await request.formData());
  } catch {
    return reply(400, 'That didn’t come through. Try again.');
  }
  // Honeypot: people never see this field, form-filling bots do.
  if (clip(body.website, 200)) return reply(200);

  const name = clip(body.name, 100);
  const email = clip(body.email, 200);
  const why = clip(body.why, 4000);
  if (!name || !email || !EMAIL.test(email) || !why) return reply(400, 'A name, an email address and a few words on why are needed.');
  if (!body.commit) return reply(400, 'The group asks for twelve weeks. Tick the box if you can commit to them.');

  const video = body.video instanceof File && body.video.size > 0 ? body.video : null;
  if (video && (!video.type.startsWith('video/') || video.size > VIDEO_MAX)) return reply(400, 'That video is too large to send. Record a shorter one.');

  const phone = clip(body.phone, 50);
  const lives = clip(body.lives, 200);
  const experience = clip(body.experience, 4000);
  const times = clip(body.times, 1000);

  const query = await db().catch(() => null);
  if (!query && !canNotify()) return reply(503, 'Applications aren’t connected yet. Email sam@peret.net instead.');
  // The video has nowhere to go but the email.
  if (video && !canNotify()) return reply(503, 'Videos can’t be sent yet. Apply without one, or email sam@peret.net.');

  const ext = video?.type.includes('mp4') ? 'mp4' : 'webm';
  const length = clip(body.video_length, 10);
  const text = [
    'Men’s group application',
    `Email: ${email}`,
    phone && `Phone: ${phone}`,
    lives && `Lives in: ${lives}`,
    `\nWhat draws him to the group:\n${why}`,
    video && `\nWhen has he felt most alive? His video is attached (${[length, `${(video.size / 1e6).toFixed(1)} MB`, ext].filter(Boolean).join(', ')}).`,
    experience && `\nExperience with men’s work or circles:\n${experience}`,
    times && `\nTimes that work:\n${times}`,
    '\nCan commit to twelve weeks: yes',
  ]
    .filter(Boolean)
    .join('\n');

  const geo = geoOf(request.headers);
  const { country, region, city } = geo;
  const device = deviceOf(request.headers.get('user-agent'));
  const session = clip(body.session, 64);

  const store = async () => {
    if (!query) return false;
    try {
      await query(
        `insert into messages (session, name, contact, body, device, country, region, city)
         values ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [session, name, [email, phone].filter(Boolean).join(' · '), text, device, country, region, city],
      );
      await query(
        `insert into events (session, type, target, path, device, country, region, city)
         values ($1, 'application', 'mens-group:apply', $2, $3, $4, $5, $6)`,
        [session, PAGE, device, country, region, city],
      );
      return true;
    } catch (err) {
      console.error('application insert failed', err);
      return false;
    }
  };

  // Two sinks, the database and Sam's inbox: the application is in if either took it, except
  // that a video only reaches Sam by email.
  const [stored, emailed] = await Promise.all([
    store(),
    notify({
      name,
      body: text,
      device,
      geo,
      subject: `Men’s group application from ${name}`,
      intro: 'applied to join the men’s group on samperet.com.',
      replyTo: email,
      attachments: video
        ? [{ filename: `mens-group-${slug(name)}.${ext}`, content: Buffer.from(await video.arrayBuffer()).toString('base64') }]
        : undefined,
    }),
  ]);
  if (video && !emailed) return reply(500, 'Your video didn’t go through. Try again, or apply without it.');
  if (!stored && !emailed) return reply(500, 'Something went wrong. Email sam@peret.net instead.');
  return reply(200);
};

export const GET: APIRoute = () => new Response('Method Not Allowed', { status: 405, headers: { Allow: 'POST' } });
