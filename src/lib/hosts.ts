// The men's group page has its own address, men.samperet.com, served from this same deployment:
// vercel.json shows the page at that host's root, sends samperet.com/mens-group/ there, and sends
// any other page asked for on that host back to samperet.com. In the build (and in development)
// the page stays at /mens-group/, and the visitor stats still log it under that path.
export const SITE_URL = 'https://samperet.com/';
export const MEN = { host: 'men.samperet.com', url: 'https://men.samperet.com/', path: '/mens-group/' };

// A page's path as the site knows it, whichever host served it.
export const sitePath = ({ hostname, pathname }: { hostname: string; pathname: string }) =>
  hostname === MEN.host ? MEN.path + pathname.slice(1) : pathname;
