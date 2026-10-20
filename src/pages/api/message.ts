// Messages visitors send through Merlin's chat. Stored with their approximate location and
// read at /backend, and emailed to Sam through Resend when RESEND_KEY is set.
import type { APIRoute } from 'astro';
import { db } from '../../lib/db';
import { canNotify, notify } from '../../lib/notify';
import { allow, clip, deviceOf, geoOf, sameOrigin } from '../../lib/visitor';

export const prerender = false;

const json = (status: number, data: object) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

export const POST: APIRoute = async ({ request, clientAddress }) => {
  if (!sameOrigin(request)) return json(403, { ok: false });
  if (!allow(`message:${clientAddress}`, 5, 10 * 60_000)) return json(429, { ok: false, error: 'Too many messages. Try again later.' });

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(await request.text());
  } catch {
    return json(400, { ok: false });
  }
  // Honeypot: people never see this field, form-filling bots do.
  if (clip(body.website, 200)) return json(200, { ok: true });

  const name = clip(body.name, 100);
  const text = clip(body.message, 4000);
  if (!name || !text) return json(400, { ok: false, error: 'A name and a message are needed.' });

  const query = await db().catch(() => null);
  if (!query && !canNotify()) return json(503, { ok: false, error: 'Messages aren’t connected yet.' });

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
        [session, name, clip(body.contact, 200), text, device, country, region, city],
      );
      await query(
        `insert into events (session, type, target, path, device, country, region, city)
         values ($1, 'message', 'merlin:message:sent', '/', $2, $3, $4, $5)`,
        [session, device, country, region, city],
      );
      return true;
    } catch (err) {
      console.error('message insert failed', err);
      return false;
    }
  };

  // Two sinks, the database and Sam's inbox: the message counts as delivered if either took it.
  const [stored, emailed] = await Promise.all([store(), notify({ name, body: text, device, geo })]);
  if (!stored && !emailed) return json(500, { ok: false, error: 'Something went wrong.' });
  return json(200, { ok: true });
};

export const GET: APIRoute = () => new Response('Method Not Allowed', { status: 405, headers: { Allow: 'POST' } });
