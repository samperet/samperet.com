// Interest topics: each homepage section lists the topics it belongs to in
// data-topics. Opening a topic expands those sections and collapses the rest; "message"
// opens no section — Merlin starts a chat instead (src/components/Merlin.astro).

export const TOPICS = {
  professional: { label: 'Professional', reply: 'Here’s the professional side.' },
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

  let first: HTMLDetailsElement | null = null;
  for (const item of document.querySelectorAll<HTMLDetailsElement>('details.item')) {
    const match = (item.dataset.topics ?? '').split(' ').includes(topic);
    item.open = match;
    if (match) first ??= item;
  }

  for (const chip of document.querySelectorAll<HTMLButtonElement>('[data-topic]')) {
    chip.setAttribute('aria-pressed', String(chip.dataset.topic === topic));
  }

  if (first) {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    first.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  }

  document.dispatchEvent(new CustomEvent('topic:open', { detail: { topic, target: first } }));
  return first;
}
