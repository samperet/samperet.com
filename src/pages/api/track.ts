// The visitor beacon from src/scripts/track.ts: page views and what was clicked, with the
// visitor's approximate location. Best effort: it never fails a page.
import type { APIRoute } from 'astro';
import { db } from '../../lib/db';
import { allow, clip, deviceOf, geoOf, isBot, sameOrigin } from '../../lib/visitor';

export const prerender = false;

const TYPES = new Set(['pageview', 'click']);
const done = (status = 204) => new Response(null, { status, headers: { 'Cache-Control': 'no-store' } });

export const POST: APIRoute = async ({ request, clientAddress }) => {
  if (!sameOrigin(request)) return done(403);
  const ua = request.headers.get('user-agent');
  if (request.headers.get('sec-gpc') === '1' || isBot(ua)) return done();
  if (!allow(`track:${clientAddress}`, 120, 60_000)) return done(429);

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(await request.text());
  } catch {
    return done(400);
  }
  const type = clip(body.type, 20);
  if (!type || !TYPES.has(type)) return done(400);

  const query = await db().catch(() => null);
  if (!query) return done();
  const { country, region, city } = geoOf(request.headers);
  await query(
    `insert into events (session, type, target, path, referrer, device, country, region, city)
     values ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [clip(body.session, 64), type, clip(body.target, 300), clip(body.path, 300), clip(body.referrer, 300), deviceOf(ua), country, region, city],
  ).catch((err) => console.error('track insert failed', err));
  return done();
};

export const GET: APIRoute = () => new Response('Method Not Allowed', { status: 405, headers: { Allow: 'POST' } });
