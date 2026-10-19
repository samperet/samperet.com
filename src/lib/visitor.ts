// What a request says about where a visitor is and what they browse with. Location comes
// from Vercel's geolocation headers; the IP address itself is never stored.

export type Geo = { country: string | null; region: string | null; city: string | null };

const header = (h: Headers, name: string) => {
  const value = h.get(name);
  if (!value) return null;
  try {
    return decodeURIComponent(value).slice(0, 80);
  } catch {
    return value.slice(0, 80);
  }
};

export const geoOf = (h: Headers): Geo => ({
  country: header(h, 'x-vercel-ip-country')?.toUpperCase().slice(0, 2) ?? null,
  region: header(h, 'x-vercel-ip-country-region'),
  city: header(h, 'x-vercel-ip-city'),
});

export const isBot = (ua: string | null) =>
  !ua || /bot|crawl|spider|slurp|preview|facebookexternalhit|embedly|lighthouse|pingdom|uptime/i.test(ua);

export const deviceOf = (ua: string | null) =>
  !ua ? 'unknown' : /ipad|tablet/i.test(ua) ? 'tablet' : /mobi|android|iphone/i.test(ua) ? 'mobile' : 'desktop';

export const sameOrigin = (request: Request) => {
  const origin = request.headers.get('origin');
  return !origin || origin === new URL(request.url).origin;
};

// A small per-instance limiter: enough to stop a loop or a burst, not a determined attacker.
const buckets = new Map<string, { count: number; reset: number }>();
export function allow(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.reset < now) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    if (buckets.size > 5000) buckets.clear();
    return true;
  }
  return ++bucket.count <= limit;
}

export const clip = (value: unknown, max: number) =>
  typeof value === 'string' && value.trim() ? value.trim().slice(0, max) : null;
