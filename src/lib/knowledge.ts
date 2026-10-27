// What Merlin knows when he answers questions (src/pages/api/ask.ts): the site's own words,
// gathered from the same data the pages render, so an edit to a card or the CV reaches him with
// the next deploy, and the places he can take a visitor (PLACES). Only what is already public on
// the site goes in.
import type { SectionData } from '../components/Section.astro';
import { BOOKS } from '../data/books';
import { boards, competencies, contact, education, initiatives, roles, summary } from '../data/career';
import { sections, projects, footerCards } from '../data/home';
import { GROUP } from '../data/mens-group';

const slug = (value: string) =>
  value.toLowerCase().replace(/['’]/g, '').replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// [words](https://…) in body text becomes "words (https://…)".
const plain = (text: string) => text.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '$1 ($2)');

const card = (s: SectionData, depth = 0): string => {
  const id = s.id ?? slug(s.name);
  const lines = [`${'#'.repeat(Math.min(depth + 3, 6))} ${s.name} (link: /#${id})`];
  if (s.intro) lines.push(s.intro);
  if (s.line) lines.push(s.line);
  for (const p of s.body ?? []) lines.push(plain(p));
  if (s.href) lines.push(`Site: ${s.href}`);
  for (const l of s.links ?? []) lines.push(`${l.label}: ${l.href}`);
  if (s.link && !s.story) lines.push(`Opens: ${s.link}`);
  if (s.story) lines.push(`A story told over the photo, in Sam's voice: "${s.story.title}"`);
  if (s.embed) lines.push(`Shows a live embed: ${s.embedTitle ?? s.embed}`);
  for (const m of s.memories ?? []) lines.push(`Recording: "${m.title}" (${m.duration})`);
  for (const p of s.photos ?? []) if (p.caption) lines.push(`Photo: ${p.caption}`);
  if (s.photos?.length) lines.push(`${s.photos.length} photos.`);
  for (const c of s.cta ?? []) lines.push(`${c.text ? `${c.text} ` : ''}Button: ${c.label} (${c.href})`);
  for (const child of [...(s.parts ?? []), ...(s.children ?? [])]) lines.push(card(child, depth + 1));
  return lines.join('\n');
};

const career = [
  ...summary,
  `Contact: email ${contact.email}, phone ${contact.phone}, LinkedIn ${contact.linkedin}, GitHub ${contact.github}.`,
  'Competencies: ' + competencies.map((c) => `${c.name} (${c.items})`).join('; ') + '.',
  ...roles.map((r) =>
    [
      `### ${r.name}${r.full ? ` (${r.full})` : ''}: ${r.title}, ${r.dates}${r.place ? `, ${r.place}` : ''} (link: /career/#${r.id})`,
      r.summary,
      r.stat ? `${r.stat.value}: ${r.stat.label}.` : '',
      ...r.highlights.map((h) => `- ${h.text}`),
      ...(r.groups ?? []).flatMap((g) => [`${g.title}:`, ...g.highlights.map((h) => `- ${h.text}`)]),
      ...(r.projects ?? []).map((p) => `- With ${p.partner}: ${p.title}. ${p.text}`),
      ...(r.photos ?? []).filter((p) => p.caption).map((p) => `Photo: ${p.caption}`),
    ]
      .filter(Boolean)
      .join('\n'),
  ),
  ...initiatives.map((i) => [`### ${i.title}`, ...i.items.map((t) => `- ${t}`), i.example ? `Example: ${i.example.name} (${i.example.href}). ${i.example.note}` : ''].join('\n')),
  'Education: ' + education.map((e) => `${e.school}, ${e.degree}, ${e.dates}${e.notes.length ? ` (${e.notes.join('; ')})` : ''}`).join('. ') + '.',
  'Boards: ' + boards.map((b) => `${b.org}, ${b.role}, ${b.years}`).join('; ') + '.',
].join('\n\n');

export const SITE = `# samperet.com

Sam Peret's personal site. Tagline: "strategy, relationships, systems & design." The homepage is a
grid of cards that open in place; a link to /#card-id opens that card. Every page ends with a
footer linking Career, Men's work, Recommended books (/#recommended-books) and Photos (/#photos).
The cards and pages are written by Sam in the first person: "I" there is Sam, never Merlin.

## Homepage cards

${sections.map((s) => card(s)).join('\n\n')}

## Projects (smaller cards on the homepage)

${projects.map((s) => card(s)).join('\n\n')}

## Recommended books (link: /#recommended-books)

${BOOKS.map((b) => `- ${b.title} by ${b.author} (about: ${b.tags.join(', ')})`).join('\n')}

## Photos (link: /#photos)

A card gathering every photo on the site, by where it appears.

## Career (link: /career/)

The CV as a page: highlight by skill (strategy, relationships, systems, design), print-friendly.

${career}

## Men's work (link: /mens-group/)

A men's group Sam is starting in Charlotte, Vermont. Creed: "Show up, share, hold each other
accountable, shift your perspective, check out in your sovereignty." Sam has sat in and built men's
circles since 2012 (he was initiated with the ManKind Project). Born in 1986, grew up in New
Hampshire, has lived in California, Australia, Maui and Portland; a dad, entrepreneur, facilitator
and yogi. He is looking for men who want to take responsibility for their lives and support the men
around them to do the same; men who can fix things, from cars to relationships; men who can say the
hard thing. Each meeting moves through four archetypes: Lover (check in, no response, no feedback),
Warrior (accountability: did you do what you said you would?), Magician (awareness, insight, change)
and King (check out in your sovereignty). Cost: no cost beyond your commitment of time. Schedule:
time and location are set once ${GROUP.size} men are ready; ${GROUP.filled} of ${GROUP.size} are in.
Apply on the page (a short form with a video answering "When have you felt most alive?"), or call
Sam at 603.531.1077 with questions.

## Picture books

- Foreside Fiasco (link: /foreside-fiasco/): an unfortunate true story, a picture book with a read-aloud.
- The Golden Berry (link: /golden-berry/): by Sam's daughter Jaya, painted in watercolor by the Ukrainian artist Kateryna Rohotova.

## HAUTomation (https://hautomation.samperet.com)

Sam's home automation practice: a technical partner for people doing custom projects, building
technology into furniture and doing creative custom work, who want someone to make it work. Sam
has been automating home systems since 2000 (${new Date().getFullYear() - 2000} years). Tools he
uses: Jellyfin and Stremio. To start, email sam@peret.net about the project.

## Merlin

Merlin, the wizard in the bottom-right corner (summoned by the hat), can open cards by topic, tell
a joke, carry a message to Sam (the "Send me a message" option), and answer questions.
`;

// Every place on the site Merlin can take a visitor: each homepage card, part and smaller card
// (opened by its /#id), the footer's books and photo groups, the career chapters, the men's
// group, the picture books and HAUTomation. `words` are other names people use for it, for the
// instant matches in his chat (src/components/Merlin.astro).
export type Place = { path: string; title: string; within?: string; words?: string };

const WORDS: Record<string, string> = {
  '/career/': 'cv resume work job jobs experience professional linkedin',
  '/mens-group/': 'mens group men group mkp circle',
  '/mens-group/#apply': 'apply application join mens group',
  '/#recommended-books': 'books reading library',
  '/#photos': 'pictures gallery',
  '/#heartwise': 'heart iq circles',
  '/#family': 'kids children jaya fiona mackensie',
  '/#travel-and-adventure': 'travel trips places',
  '/#stories': 'picture books',
};

const placesOf = (s: SectionData, within?: string): Place[] => {
  const id = s.id ?? slug(s.name);
  // A link tile goes where it links, unless it is a photo with a story, which opens in its card.
  const path = s.link && !s.story ? s.link : `/#${id}`;
  return [{ path, title: s.name, within }, ...[...(s.parts ?? []), ...(s.children ?? [])].flatMap((c) => placesOf(c, s.name))];
};

const careerSections = [
  ['summary', 'Summary'],
  ['competencies', 'Competencies'],
  ['initiatives', 'Technology & AI'],
  ['education', 'Education'],
  ['community', 'Community'],
  ['boards', 'Boards'],
  ['awards', 'Awards'],
];

// In order of preference when two fit a request equally well.
export const PLACES: Place[] = [
  ...[...sections, ...projects].flatMap((s) => placesOf(s)),
  { path: '/career/', title: 'Career' },
  ...roles.map((r) => ({ path: `/career/#${r.id}`, title: r.name, within: 'Career' })),
  ...careerSections.map(([id, title]) => ({ path: `/career/#${id}`, title, within: 'Career' })),
  { path: '/mens-group/', title: 'the men’s group' },
  { path: '/mens-group/#apply', title: 'Apply to the men’s group', within: 'Men’s work' },
  ...footerCards.flatMap((s) => placesOf(s)),
]
  .filter((p, i, all) => all.findIndex((q) => q.path === p.path) === i)
  .map((p) => (WORDS[p.path] ? { ...p, words: WORDS[p.path] } : p));
