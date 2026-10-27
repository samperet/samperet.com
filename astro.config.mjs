// @ts-check
import { defineConfig, envField, fontProviders } from 'astro/config';
import vercel from '@astrojs/vercel';

// Static site. The on-demand routes are the tracking beacon, Merlin's messages and answers
// (src/pages/api/) and the password-protected traffic dashboard at /backend.
export default defineConfig({
  site: 'https://samperet.com',
  output: 'static',
  adapter: vercel(),
  // Fraunces is the display face (headings, the wordmark, the tagline); body text is the
  // system font. Self-hosted at build, so nothing is fetched from Google at runtime.
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Fraunces',
      cssVariable: '--font-fraunces',
      weights: [400, 500, 600],
      styles: ['normal', 'italic'],
      subsets: ['latin'],
      fallbacks: ['Iowan Old Style', 'Georgia', 'serif'],
      formats: ['woff2'],
    },
    // Oswald, a condensed grotesque, is the men's group page's own face: that page is darker and
    // rougher than the rest of the site. Loaded only there.
    {
      provider: fontProviders.google(),
      name: 'Oswald',
      cssVariable: '--font-oswald',
      weights: [500, 600, 700],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['Arial Narrow', 'Impact', 'sans-serif'],
      formats: ['woff2'],
    },
  ],
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
      // Anthropic API key: Merlin answers visitors' questions with it (src/pages/api/ask.ts).
      // Without it he says he can't answer just now and offers to take a message.
      ANTHROPIC_API: envField.string({ context: 'server', access: 'secret', optional: true }),
      // Password for /backend (any username). Without it, /backend stays locked.
      BACKEND_PASSWORD: envField.string({ context: 'server', access: 'secret', optional: true }),
      // Password for /admin (any username). Without it, /admin uses the hashed default in src/middleware.ts.
      ADMIN_PASSWORD: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },
});
