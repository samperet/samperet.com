// Shared by the photo viewer's stories and the book reader: WebVTT subtitles, the audio
// format fallback, and a m:ss clock.

export type Cue = { start: number; end: number; text: string };

// Enough of WebVTT for our own files: "mm:ss.mmm --> mm:ss.mmm" blocks with text lines.
const toSeconds = (stamp: string) => stamp.trim().split(':').reduce((total, part) => total * 60 + Number(part), 0);

export const parseVtt = (text: string): Cue[] =>
  text
    .replace(/\r/g, '')
    .split(/\n\n+/)
    .map((block) => block.split('\n'))
    .flatMap((lines) => {
      const at = lines.findIndex((l) => l.includes('-->'));
      if (at < 0) return [];
      const [start, end] = lines[at].split('-->');
      return [{ start: toSeconds(start), end: toSeconds(end), text: lines.slice(at + 1).join('\n').trim() }];
    });

const cueCache = new Map<string, Promise<Cue[]>>();
export const loadCues = (url: string) => {
  let pending = cueCache.get(url);
  if (!pending) {
    pending = fetch(url)
      .then((r) => (r.ok ? r.text() : ''))
      .then(parseVtt)
      .catch(() => []);
    cueCache.set(url, pending);
  }
  return pending;
};

export const cueAt = (cues: Cue[], t: number) => cues.find((c) => t >= c.start && t < c.end)?.text ?? '';

// Recordings ship as .m4a with an .mp3 beside it; browsers without AAC get the MP3.
export const pickSource = (audio: HTMLAudioElement, url: string) =>
  url.endsWith('.m4a') && !audio.canPlayType('audio/mp4; codecs="mp4a.40.2"') ? url.replace(/\.m4a$/, '.mp3') : url;

export const clock = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
