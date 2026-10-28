// Pages with an address of their own, served from this same deployment: men.samperet.com (the
// men's group) and family.samperet.com (the family page, unlisted: nothing on samperet.com links
// to it, and it asks search engines to leave it out). vercel.json shows each page at its host's
// root and sends any other page asked for on those hosts back to samperet.com; samperet.com's
// /mens-group/ and /family/ redirect to them. In the build (and in development) each page keeps
// its path, and the visitor stats log it under that path.
export const SITE_URL = 'https://samperet.com/';
export const MEN = { host: 'men.samperet.com', url: 'https://men.samperet.com/', path: '/mens-group/' };
// Only the family page imports this, so the address stays out of the scripts every page loads.
export const FAMILY = { host: 'family.samperet.com', url: 'https://family.samperet.com/', path: '/family/' };

// A page's path as the site knows it, whichever host served it. The family page says its own
// path to the visitor stats (startTracking in src/scripts/track.ts), so it isn't named here.
export const sitePath = ({ hostname, pathname }: { hostname: string; pathname: string }) =>
  hostname === MEN.host ? MEN.path + pathname.slice(1) : pathname;
