// A photo anywhere on the site. `thumb` is a smaller copy shown in a gallery (the full one opens
// in the viewer); `width` and `height` are the shown copy's size, read from the file when left
// out. A photo may carry Sam's own caption, shown under it in the viewer, or a story: audio
// told over it, with WebVTT captions as subtitles (played by PhotoViewer.astro).
export type Photo = {
  src: string;
  thumb?: string;
  width?: number;
  height?: number;
  alt: string;
  caption?: string;
  story?: { title: string; audio: string; captions: string };
};

// The career chapters' photos, shown on /career/ and in the Photos card on the homepage.
export const ALPS_PHOTOS: Photo[] = [
  { src: '/photos/alps/pitch.webp', thumb: '/photos/alps/pitch-640.webp', width: 640, height: 427, alt: 'Sam, two thumbs up, presenting beside a technology founder at an ALPS executive event, with a blockchain architecture poster behind them' },
  { src: '/photos/alps/crew.webp', thumb: '/photos/alps/crew-640.webp', width: 640, height: 427, alt: 'ALPS advisors in matching navy jackets giving thumbs up on a boat off a Maine lighthouse' },
  { src: '/photos/alps/helm.webp', thumb: '/photos/alps/helm-640.webp', width: 480, height: 640, alt: 'Sam at the helm of a boat on a bright day in Maine, looking back over his shoulder' },
  { src: '/photos/alps/gala.webp', thumb: '/photos/alps/gala-640.webp', width: 543, height: 640, alt: 'Sam with ALPS advisor Steve Bergson, both smiling, at an evening ALPS event' },
];

export const AIRBNB_PHOTOS: Photo[] = [
  {
    src: '/photos/airbnb-bearshark.jpg',
    alt: 'A bear-shark sculpture, half polar bear and half shark, suspended from the ceiling of an Airbnb office',
    story: { title: 'The story of the bear shark', audio: '/stories/bear-shark.m4a', captions: '/stories/bear-shark.vtt' },
  },
  { src: '/photos/airbnb-wood-ball.jpg', alt: 'Selfie in safety glasses in a workshop, in front of a giant sphere made of patchwork wood' },
  { src: '/photos/airbnb-bow-tie.webp', alt: 'A selfie in a grey vest and red bow tie at the Airbnb office, colleagues at a cart behind' },
  {
    src: '/photos/airbnb-table.webp',
    alt: 'A long glossy black table on a cross-shaped wooden base, with benches either side, in a meeting room with red curtains and a brick wall',
    caption: 'The table I designed and made: Brian Chesky’s favorite table in the office',
  },
  {
    src: '/photos/airbnb-503-sign.webp',
    alt: 'Marquee letters reading 503, made of wood and studded with round bulbs, on a red brick wall',
    caption: 'The 503 sign I designed and made for our corporate restaurant',
  },
];
