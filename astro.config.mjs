// @ts-check
import { defineConfig, envField } from 'astro/config';
import vercel from '@astrojs/vercel';

// Static site. The on-demand routes are the tracking beacon and Merlin's messages
// (src/pages/api/) and the password-protected traffic dashboard at /backend.
export default defineConfig({
  site: 'https://samperet.com',
  output: 'static',
  adapter: vercel(),
  env: {
    schema: {
      // Any Postgres connection string (Neon, Supabase, Vercel Postgres). Without it, local
      // development uses an in-memory PGlite database and production drops events.
      DATABASE_URL: envField.string({ context: 'server', access: 'secret', optional: true }),
      // Password for /backend (any username). Without it, /backend stays locked.
      BACKEND_PASSWORD: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },
});
