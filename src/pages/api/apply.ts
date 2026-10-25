// Applications to the men's group (/mens-group/). Kept with Merlin's messages, so they show at
// /backend, and emailed to Sam with the applicant as the reply-to. The page posts JSON; without
// JavaScript the form posts itself and is sent back to the page, to its thank-you note.
import type { APIRoute } from 'astro';
import { db } from '../../lib/db';
import { canNotify, notify } from '../../lib/notify';
import { allow, clip, deviceOf, geoOf, sameOrigin } from '../../lib/visitor';

export const prerender = false;

const PAGE = '/mens-group/';
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const isForm = !request.headers.get('content-type')?.includes('application/json');
  const reply = (status: number, error?: string) =>
    isForm
      ? new Response(null, { status: 303, headers: { Location: `${PAGE}#${error ? 'apply-failed' : 'applied'}` } })
      : new Response(JSON.stringify(error ? { ok: false, error } : { ok: true }), {
          status,
          headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
        });

  if (!sameOrigin(request)) return reply(403, 'Not allowed.');
  if (!allow(`apply:${clientAddress}`, 3, 10 * 60_000)) return reply(429, 'Too many applications. Try again later.');

  let body: Record<string, unknown>;
  try {
    body = isForm ? Object.fromEntries(await request.formData()) : JSON.parse(await request.text());
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

  const phone = clip(body.phone, 50);
  const lives = clip(body.lives, 200);
  const experience = clip(body.experience, 4000);
  const times = clip(body.times, 1000);

  const query = await db().catch(() => null);
  if (!query && !canNotify()) return reply(503, 'Applications aren’t connected yet. Email sam@peret.net instead.');

  const text = [
    'Men’s group application',
    `Email: ${email}`,
    phone && `Phone: ${phone}`,
    lives && `Lives in: ${lives}`,
    `\nWhat draws him to the group:\n${why}`,
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

  // Two sinks, the database and Sam's inbox: the application is in if either took it.
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
    }),
  ]);
  if (!stored && !emailed) return reply(500, 'Something went wrong. Email sam@peret.net instead.');
  return reply(200);
};

export const GET: APIRoute = () => new Response('Method Not Allowed', { status: 405, headers: { Allow: 'POST' } });
