// /backend is behind HTTP Basic auth: any username, the password in BACKEND_PASSWORD.
import { defineMiddleware } from 'astro:middleware';
import { BACKEND_PASSWORD } from 'astro:env/server';

const digest = async (value: string) => new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)));

async function matches(given: string, expected: string) {
  const [a, b] = await Promise.all([digest(given), digest(expected)]);
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

export const onRequest = defineMiddleware(async (context, next) => {
  if (!context.url.pathname.startsWith('/backend')) return next();

  const headers = { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' };
  if (!BACKEND_PASSWORD) return new Response('The backend is locked: BACKEND_PASSWORD is not set.', { status: 503, headers });

  const auth = context.request.headers.get('authorization') ?? '';
  const [scheme, encoded] = auth.split(' ');
  let password = '';
  if (scheme === 'Basic' && encoded) {
    try {
      password = atob(encoded).split(':').slice(1).join(':');
    } catch {}
  }
  if (!password || !(await matches(password, BACKEND_PASSWORD))) {
    return new Response('Authentication required.', {
      status: 401,
      headers: { ...headers, 'WWW-Authenticate': 'Basic realm="samperet.com backend", charset="UTF-8"' },
    });
  }
  const response = await next();
  for (const [k, v] of Object.entries(headers)) response.headers.set(k, v);
  return response;
});
