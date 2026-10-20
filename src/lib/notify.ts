// Emails Sam each message sent through Merlin, by Resend's HTTP API. Best effort: a failure is
// logged and the message is still kept in the database.
import { MESSAGE_NOTIFY_TO, RESEND_FROM, RESEND_KEY } from 'astro:env/server';
import type { Geo } from './visitor';

export type Notice = { name: string; body: string; device: string; geo: Geo };

const escape = (text: string) =>
  text.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

const place = ({ city, region, country }: Geo) => [city, region, country].filter(Boolean).join(', ') || 'Unknown location';

// If the visitor put an email address in the message, replies go straight to them.
const replyTo = (body: string) => body.match(/[\w.+-]+@[\w-]+(\.[\w-]+)+/)?.[0];

export const canNotify = () => Boolean(RESEND_KEY && MESSAGE_NOTIFY_TO);

export async function notify({ name, body, device, geo }: Notice): Promise<boolean> {
  if (!RESEND_KEY || !MESSAGE_NOTIFY_TO) return false;
  const where = `${place(geo)} · ${device}`;
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(8000),
      body: JSON.stringify({
        from: RESEND_FROM,
        to: [MESSAGE_NOTIFY_TO],
        reply_to: replyTo(body),
        subject: `Message from ${name} via Merlin`,
        text: `${name} sent a message through Merlin on samperet.com.\n\n${body}\n\n— ${where}`,
        html: `<p><strong>${escape(name)}</strong> sent a message through Merlin on samperet.com.</p>
<blockquote style="margin:0;padding:0.5em 1em;border-left:3px solid #ccc;white-space:pre-wrap">${escape(body)}</blockquote>
<p style="color:#666;font-size:0.9em">${escape(where)}</p>`,
      }),
    });
    if (!res.ok) console.error('resend failed', res.status, await res.text().catch(() => ''));
    return res.ok;
  } catch (err) {
    console.error('resend failed', err);
    return false;
  }
}
