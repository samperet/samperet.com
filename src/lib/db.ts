// The one database: visitor events and Merlin's messages. Production talks to Postgres at
// DATABASE_URL; local development without it runs an in-memory PGlite instead. Tables are
// created on first use, so a fresh database needs no setup.
import { DATABASE_URL } from 'astro:env/server';

type Row = Record<string, unknown>;
export type Query = <T extends Row = Row>(text: string, params?: unknown[]) => Promise<T[]>;

const SCHEMA = `
  create table if not exists events (
    id bigserial primary key,
    at timestamptz not null default now(),
    session text,
    type text not null,
    target text,
    path text,
    referrer text,
    device text,
    country text,
    region text,
    city text
  );
  create index if not exists events_at on events (at desc);
  create table if not exists messages (
    id bigserial primary key,
    at timestamptz not null default now(),
    session text,
    name text not null,
    contact text,
    body text not null,
    device text,
    country text,
    region text,
    city text
  );
  create index if not exists messages_at on messages (at desc);
`;

let ready: Promise<Query | null> | undefined;

async function connect(): Promise<Query | null> {
  if (DATABASE_URL) {
    const { default: postgres } = await import('postgres');
    // prepare: false keeps it compatible with transaction-mode poolers (Supabase, Neon).
    const sql = postgres(DATABASE_URL, { prepare: false, max: 1, idle_timeout: 20 });
    const query: Query = async (text, params = []) => (await sql.unsafe(text, params as never[])) as never;
    await sql.unsafe(SCHEMA);
    return query;
  }
  if (import.meta.env.DEV) {
    const { PGlite } = await import('@electric-sql/pglite');
    const pg = new PGlite();
    await pg.exec(SCHEMA);
    return async (text, params = []) => (await pg.query(text, params)).rows as never;
  }
  return null;
}

/** The database, or null when none is configured. */
export function db(): Promise<Query | null> {
  ready ??= connect().catch((err) => {
    ready = undefined;
    throw err;
  });
  return ready;
}
