// Recommended books, each tagged with the interests it belongs to. A homepage card or a page
// names its interests, and a shelf at its foot shows the books tagged with any of them
// (src/components/Shelf.astro); the Recommended Books card in the footer shows them all.
//
// Interests in use: yoga, sufism, spirituality, heartwise, circles (the Spirituality card's
// parts), travel, adventure, stories, family (homepage cards), men (/mens-group/), career,
// leadership (/career/). Tag a book with any of them and it appears there.
export type Book = {
  title: string;
  author: string;
  cover: string;
  href: string;
  width: number;
  height: number;
  tags: string[];
};

export const BOOKS: Book[] = [
  {
    title: 'How Yoga Works',
    author: 'Geshe Michael Roach & Christie McNally',
    cover: '/reading/how-yoga-works.webp',
    href: 'https://openlibrary.org/works/OL490414W',
    width: 328,
    height: 500,
    tags: ['yoga'],
  },
  {
    title: 'Hatha Yoga Pradipika',
    author: 'Svatmarama, translated by Brian Dana Akers',
    cover: '/reading/hatha-yoga-pradipika.webp',
    href: 'https://openlibrary.org/isbn/9780971646612',
    width: 332,
    height: 500,
    tags: ['yoga'],
  },
  {
    title: 'Death: An Inside Story',
    author: 'Sadhguru',
    cover: '/reading/death-an-inside-story.webp',
    href: 'https://openlibrary.org/works/OL22292279W',
    width: 230,
    height: 360,
    tags: ['spirituality'],
  },
  {
    title: 'The Magus of Java',
    author: 'Kosta Danaos',
    cover: '/reading/the-magus-of-java.webp',
    href: 'https://openlibrary.org/works/OL7796870W',
    width: 317,
    height: 475,
    tags: ['spirituality'],
  },
  {
    title: 'The E-Myth Revisited',
    author: 'Michael E. Gerber',
    cover: '/reading/the-e-myth-revisited.webp',
    href: 'https://openlibrary.org/isbn/9780887307287',
    width: 313,
    height: 500,
    tags: ['career', 'leadership'],
  },
  {
    title: 'The Go-Giver',
    author: 'Bob Burg & John David Mann',
    cover: '/reading/the-go-giver.webp',
    href: 'https://openlibrary.org/isbn/9781591842002',
    width: 177,
    height: 280,
    tags: ['career', 'leadership'],
  },
];

export const booksFor = (interests: readonly string[] | 'all') =>
  interests === 'all' ? BOOKS : BOOKS.filter((book) => book.tags.some((tag) => interests.includes(tag)));
