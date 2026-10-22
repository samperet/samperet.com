// Interest topics: each homepage section lists the topics it belongs to in
// data-topics (a parent row lists its children's too, so it opens with them). Opening a
// topic expands those sections and collapses the rest; "message"
// opens no section — Merlin starts a chat instead (src/components/Merlin.astro). A topic with an
// `href` has its own page: "professional" goes to /career/.

export const TOPICS = {
  professional: { label: 'Professional', reply: 'Here’s the professional side.', href: '/career/' },
  personal: { label: 'Personal', reply: 'A little more personal.' },
  family: { label: 'Family', reply: 'Family first!' },
  adventure: { label: 'Adventure', reply: 'Adventure awaits!' },
  message: { label: 'Send me a message', reply: 'Happy to deliver a message to Sam.' },
} as const;

export type Topic = keyof typeof TOPICS;

export const isTopic = (value: unknown): value is Topic =>
  typeof value === 'string' && value in TOPICS;

export function openTopic(topic: Topic): HTMLDetailsElement | null {
  if (topic === 'message') {
    document.dispatchEvent(new CustomEvent('topic:open', { detail: { topic, target: null } }));
    return null;
  }

  const href = (TOPICS[topic] as { href?: string }).href;
  if (href && location.pathname !== href) {
    location.assign(href);
    return null;
  }

  let first: HTMLDetailsElement | null = null;
  for (const item of document.querySelectorAll<HTMLDetailsElement>('details.item')) {
    const match = (item.dataset.topics ?? '').split(' ').includes(topic);
    item.open = match;
    if (match) first ??= item;
  }

  if (first) {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    first.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  }

  document.dispatchEvent(new CustomEvent('topic:open', { detail: { topic, target: first } }));
  return first;
}
