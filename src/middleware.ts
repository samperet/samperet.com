// Two areas behind HTTP Basic auth (any username):
// - /backend, the traffic dashboard: the password in BACKEND_PASSWORD; locked when it is unset.
// - /admin, the content studio: ADMIN_PASSWORD when set; otherwise the password whose salted
//   PBKDF2 hash is below. The repository is public, so only the hash lives here.
import { defineMiddleware } from 'astro:middleware';
import { ADMIN_PASSWORD, BACKEND_PASSWORD } from 'astro:env/server';

const ADMIN_HASH = {
  salt: '33b344858142e2d3914f59a6a7e1bf8d',
  iterations: 210000,
  hash: '3d382a324afcef670500ed598ea930e3d688311a7bb2a8906ca7a2f24f04656e',
};

const bytes = (hex: string) => new Uint8Array(hex.match(/../g)!.map((b) => parseInt(b, 16)));
const sha256 = async (value: string) => new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)));

function same(a: Uint8Array, b: Uint8Array) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

async function matches(given: string, expected: string) {
  return same(await sha256(given), await sha256(expected));
}

async function matchesAdminHash(given: string) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(given), 'PBKDF2', false, ['deriveBits']);
  const derived = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: bytes(ADMIN_HASH.salt), iterations: ADMIN_HASH.iterations },
    key,
    256,
  );
  return same(new Uint8Array(derived), bytes(ADMIN_HASH.hash));
}

const AREAS = [
  {
    prefix: '/backend',
    realm: 'samperet.com backend',
    locked: () => (BACKEND_PASSWORD ? null : 'The backend is locked: BACKEND_PASSWORD is not set.'),
    check: (password: string) => matches(password, BACKEND_PASSWORD!),
  },
  {
    prefix: '/admin',
    realm: 'samperet.com admin',
    locked: () => null,
    check: (password: string) => (ADMIN_PASSWORD ? matches(password, ADMIN_PASSWORD) : matchesAdminHash(password)),
  },
];

export const onRequest = defineMiddleware(async (context, next) => {
  const area = AREAS.find((a) => context.url.pathname.startsWith(a.prefix));
  if (!area) return next();

  const headers = { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' };
  const locked = area.locked();
  if (locked) return new Response(locked, { status: 503, headers });

  const auth = context.request.headers.get('authorization') ?? '';
  const [scheme, encoded] = auth.split(' ');
  let password = '';
  if (scheme === 'Basic' && encoded) {
    try {
      password = atob(encoded).split(':').slice(1).join(':');
    } catch {}
  }
  if (!password || !(await area.check(password))) {
    return new Response('Authentication required.', {
      status: 401,
      headers: { ...headers, 'WWW-Authenticate': `Basic realm="${area.realm}", charset="UTF-8"` },
    });
  }
  const response = await next();
  for (const [k, v] of Object.entries(headers)) response.headers.set(k, v);
  return response;
});
