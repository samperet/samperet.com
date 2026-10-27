// Logs page views and what visitors click to /api/track, under a per-tab session id.
// Nothing is sent when the browser signals Global Privacy Control or Do Not Track.
import { sitePath } from '../lib/hosts';

const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
const enabled = !nav.globalPrivacyControl && nav.doNotTrack !== '1';

const session = (() => {
  const key = 'samperet:session';
  try {
    let id = sessionStorage.getItem(key);
    if (!id) sessionStorage.setItem(key, (id = crypto.randomUUID()));
    return id;
  } catch {
    return crypto.randomUUID();
  }
})();

export const sessionId = () => session;

export function track(type: 'pageview' | 'click', target?: string) {
  if (!enabled) return;
  const body = JSON.stringify({
    type,
    target,
    session,
    path: sitePath(location),
    referrer: type === 'pageview' ? document.referrer : undefined,
  });
  const blob = new Blob([body], { type: 'application/json' });
  if (!navigator.sendBeacon?.('/api/track', blob)) {
    fetch('/api/track', { method: 'POST', body, keepalive: true, headers: { 'Content-Type': 'application/json' } }).catch(() => {});
  }
}

// What a click was on: an explicit data-track label, a section row, a link or photo, or a button.
function label(el: Element): string | null {
  const tagged = el.closest<HTMLElement>('[data-track]');
  const target = el.closest('[data-track], summary, a, button');
  if (!target) return null;
  if (target === tagged) return tagged.dataset.track ?? null;
  if (target instanceof HTMLElement && target.tagName === 'SUMMARY') {
    const details = target.parentElement as HTMLDetailsElement;
    // The click lands before the row toggles, so the new state is the opposite of the current one.
    return `section:${details.id}:${details.open ? 'close' : 'open'}`;
  }
  if (target instanceof HTMLAnchorElement) return `${target.querySelector('img') ? 'photo' : 'link'}:${target.getAttribute('href')}`;
  return `button:${target.textContent?.trim().slice(0, 60)}`;
}

let started = false;
export function startTracking() {
  if (started) return;
  started = true;
  track('pageview');
  document.addEventListener(
    'click',
    (e) => {
      const name = label(e.target as Element);
      if (name) track('click', name);
    },
    { capture: true },
  );
}
