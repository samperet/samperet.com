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
      // Any Postgres connection string (Neon, Supabase, Vercel Postgres). Vercel's database
      // integrations set DATABASE_URL and/or POSTGRES_URL; either works. Without one, local
      // development uses an in-memory PGlite database and production drops events.
      DATABASE_URL: envField.string({ context: 'server', access: 'secret', optional: true }),
      POSTGRES_URL: envField.string({ context: 'server', access: 'secret', optional: true }),
      // Resend: each message sent through Merlin is also emailed to MESSAGE_NOTIFY_TO.
      RESEND_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      RESEND_FROM: envField.string({ context: 'server', access: 'secret', optional: true, default: 'Merlin <merlin@samperet.com>' }),
      MESSAGE_NOTIFY_TO: envField.string({ context: 'server', access: 'secret', optional: true, default: 'samperet@gmail.com' }),
      // Password for /backend (any username). Without it, /backend stays locked.
      BACKEND_PASSWORD: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },
});
