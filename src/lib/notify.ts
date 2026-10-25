// Emails Sam each message sent through Merlin (and each men's group application), by Resend's
// HTTP API. Best effort: a failure is logged and the message is still kept in the database.
import { MESSAGE_NOTIFY_TO, RESEND_FROM, RESEND_KEY } from 'astro:env/server';
import type { Geo } from './visitor';

// `subject`, `intro` (what follows the sender's name) and `replyTo` default to a Merlin message's.
export type Notice = { name: string; body: string; device: string; geo: Geo; subject?: string; intro?: string; replyTo?: string };

const escape = (text: string) =>
  text.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

const place = ({ city, region, country }: Geo) => [city, region, country].filter(Boolean).join(', ') || 'Unknown location';

// If the visitor put an email address in the message, replies go straight to them.
const replyTo = (body: string) => body.match(/[\w.+-]+@[\w-]+(\.[\w-]+)+/)?.[0];

export const canNotify = () => Boolean(RESEND_KEY && MESSAGE_NOTIFY_TO);

export async function notify({ name, body, device, geo, subject, intro = 'sent a message through Merlin on samperet.com.', replyTo: to }: Notice): Promise<boolean> {
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
        reply_to: to ?? replyTo(body),
        subject: subject ?? `Message from ${name} via Merlin`,
        text: `${name} ${intro}\n\n${body}\n\n— ${where}`,
        html: `<p><strong>${escape(name)}</strong> ${escape(intro)}</p>
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
