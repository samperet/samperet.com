// The homepage's cards, rendered by src/pages/index.astro and read by Merlin when he answers
// questions about the site (src/lib/knowledge.ts).
import type { SectionData, Photo } from '../components/Section.astro';
import { ALPS_PHOTOS, AIRBNB_PHOTOS } from './photos';
import { MEN } from '../lib/hosts';

// Copy is deliberately thin — edit freely. Each section is a tile: `tile` is its face, `body` the
// longer text that unfolds when it opens;
// `topics` decides which of Merlin's questions (see scripts/topics.ts) opens the section.
// The professional chapters (ALPS, Founders Wanted, Airbnb) live on /career/.
export const sections: SectionData[] = [
  {
    name: 'Travel & Adventure',
    topics: ['adventure', 'personal'],
    interests: ['travel', 'adventure'],
    line: 'Places, adventures and disaster relief that shaped how I see things.',
    tile: { kind: 'Travel & adventure', src: '/travel/camel.webp', position: 'center 60%' },
    embed: '/globe/index.html',
    embedTitle: 'A globe tracing my travels: drag to turn it',
    embedRatio: '16 / 10',
    photos: [
      {
        src: '/travel/lava-flow-big-island.webp',
        alt: 'Two men throwing shakas at night in front of glowing red lava on the Big Island of Hawaiʻi',
        caption: 'Hiking to the full moon lava flow on the Big Island after MKP Initiation in 2012',
      },
      { src: '/travel/australia-pinnacles.jpg', alt: 'Tree pose on a limestone pillar in the Pinnacles desert, Western Australia' },
      { src: '/travel/pinnacle-perch.webp', alt: 'Sitting on top of a limestone pinnacle in the Pinnacles desert' },
      { src: '/travel/india-cafe.jpg', alt: 'Working on a laptop in a beach café in India, under a hand-painted menu board' },
      { src: '/travel/temple-floor.webp', alt: 'Sitting on the stone floor of an old pillared temple in India, legs stretched out in the shade' },
      { src: '/travel/temple-niche.webp', alt: 'Two friends sitting in a niche of a carved stone temple façade in India' },
      { src: '/travel/nepal-stupa.jpg', alt: 'Sitting cross-legged on a brick wall beside a stupa in Nepal' },
      { src: '/travel/camel.webp', alt: 'Riding a decorated camel with two young men in a desert valley, the camel stretching up to eat from a tree' },
      { src: '/travel/train-window.webp', alt: 'In a captain’s hat in a train compartment, talking with a fellow traveler through the open window' },
      { src: '/travel/high-desert.webp', alt: 'A windswept selfie in a paisley shirt and bandana on a wide high-desert plain, hills behind' },
      { src: '/travel/coast-selfie.webp', alt: 'A selfie with a companion on a grassy headland above the sea, sea stacks behind' },
      { src: '/travel/white-sand.webp', alt: 'A faded print: shirtless in jeans on a wide white beach, a shirt over one shoulder' },
      { src: '/travel/two-hats.webp', alt: 'Two travellers in wide-brimmed hats, grinning, on an overgrown trail' },
      { src: '/travel/cliff-jump.webp', alt: 'Leaping from a sea cliff into the water' },
      { src: '/travel/mast-top.webp', alt: 'Sitting out at the end of a wooden boom, high against a clear blue sky' },
      { src: '/travel/paramotor-sky.webp', alt: 'A paramotor under a yellow wing, high in a clear blue sky' },
      { src: '/travel/paramotor-snow.webp', alt: 'Strapped into a paramotor on the snow, propeller cage behind, about to take off' },
      { src: '/photos/tacloban-hospital.jpg', alt: 'The relief team on the steps of R.T. Romualdez Hospital in Tacloban' },
      { src: '/photos/tacloban-c130.jpg', alt: 'The team in scrubs with backpacks beside a C-130 on a rain-soaked runway' },
      { src: '/photos/new-orleans-katrina.jpg', alt: 'Volunteers with a resident beside a storm-damaged house marked FEMA in New Orleans' },
    ],
  },
  {
    name: 'Yoga, Spirituality & Personal Development',
    topics: ['personal'],
    line: 'Yogi, Sufi, group leader, lifelong student.',
    tile: { kind: 'Practice', src: '/photos/acro-sunset.webp', alt: 'Acro yoga silhouetted against the sunset on a beach', position: 'center 40%' },
    // Three parts; Merlin asks which one the visitor came for, and the card narrows to it.
    ask: 'What are you drawn to?',
    parts: [
      {
        name: 'Yoga',
        interests: ['yoga'],
        body: [
          'Yoga has been a pillar in my life since I was 18 years old. Beyond the physical benefits of asana, yoga has provided a foundation of community, health, and spiritual growth.',
          'With a focus on Patanjali’s eight-limbed path to enlightenment, I’m currently enrolled in eighth series Ashtanga, aka parenting.',
          'I pay homage to the many teachers who have crossed my path, given generously of their wisdom, and paved the path for what is to come.',
        ],
        photos: [
          { src: '/photos/yoga-squat.webp', alt: 'A deep squat on a mat on a stone patio, a dog lying alongside' },
          { src: '/photos/acro-balance.webp', alt: 'Acro yoga under the palms: balancing on a partner’s feet, hands joined' },
          { src: '/photos/acro-sunset.webp', alt: 'Acro yoga silhouetted against the sunset on a beach' },
          { src: '/travel/sunset-beach-friends.webp', alt: 'Laughing with a friend on a wide beach at sunset, the tide out' },
          { src: '/travel/shore-circle.webp', alt: 'A yoga group seated cross-legged on the sand as a wave breaks on the rocks behind them' },
          { src: '/travel/pinnacles-handstand.webp', alt: 'A handstand on the sand among the limestone pillars of the Pinnacles' },
        ],
        children: [
          {
            name: 'Intelligent Embodiment',
            intro: 'My life partner has an incredible practice as a yoga teacher, medical intuitive and massage therapist. Her offerings can be found here:',
            topics: ['family', 'personal'],
            line: 'Awake in the body.',
            tile: { kind: 'My partner’s work', src: '/tiles/intelligent-embodiment.webp', position: 'center 30%' },
            body: [
              'My life partner, Mackensie Grant, practises intuitive massage and bodywork in Charlotte, Vermont. Specializing with women, she draws on craniosacral therapy, polarity therapy and Temple Lomi, and three decades of yoga, qigong and teaching. Her sessions meet physical tension and pain, and often lead to insight about its deeper roots.',
              'I designed and built intelligentembodiment.com for her.',
            ],
            href: 'https://www.intelligentembodiment.com',
          },
        ],
      },
      {
        name: 'Sufism',
        interests: ['sufism', 'spirituality'],
        body: [
          'During a six-month pilgrimage through India, I stumbled upon a Sufi community in Rajasthan. That planted the seed for what would later lead me to my life partner, Mackensie, and my initiation into the Ruhaniat lineage of Sufism, where I received my spiritual name. You can hear more about this in [the podcast](https://mcleanp.substack.com/p/day-447-the-family-of-things?utm_source=substack&utm_medium=web&utm_content=embedded-post), hosted by a dear brother of mine through the ManKind Project (MKP).',
        ],
        children: [
          {
            name: 'SamaSangha',
            intro: 'I built this site for my Sufi community:',
            topics: ['personal'],
            line: 'A Sufi community in Massachusetts.',
            tile: { kind: 'Community', src: '/tiles/samasangha.webp', alt: 'The Sufi winged heart, a crescent and star on a red heart, over a blue tiled mosaic', position: 'center 30%' },
            body: [
              'SamaSangha is the Sufi community in Western Massachusetts where I was initiated with Abraham and Halima.',
              'I designed and built samasangha.org for them.',
            ],
            href: 'https://samasangha.org',
          },
        ],
      },
      {
        name: 'Get HeartWise',
        id: 'heartwise', // where links to the old HeartWise card land
        interests: ['heartwise', 'circles'],
        body: [
          'The ManKind Project (MKP) has also played a pivotal role in my development since my initiation in 2012: I have joined and built men’s circles, participated in and facilitated trainings, and cultivated a fascination with circle dynamics that would later lead to my work with Heart iQ.',
          'HeartWise is where I bring Heart iQ to people. Heart iQ starts from a simple observation: some parts of us only appear in the presence of other people. Most personal growth happens alone, reading and reflecting, yet the places shaped in relationship stay hidden in solitude and return when someone comes close. A circle that is held well enough, for long enough, becomes a place to be met rather than to perform or be fixed, and the group can reach places together that none of us could reach alone.',
          'I have been leading exquisite circles of healing and transformation since 2016.',
        ],
        photos: [
          { src: '/photos/heartwise-circle.webp', alt: 'A HeartWise circle: some thirty people piled together, smiling, on the floor of a studio after a workshop' },
          { src: '/photos/heartwise-group.webp', alt: 'A HeartWise group standing together under the beams of a timber hall after a workshop' },
          { src: '/photos/heartwise-rug-circle.webp', alt: 'A circle on a patterned rug in a bright room, snow outside, one person standing to speak' },
          { src: '/photos/heartwise-embrace.webp', alt: 'A HeartWise circle in a heap of hugs on a living-room floor' },
        ],
        cta: [
          { label: 'getheartwise.com', href: 'https://www.getheartwise.com' },
          { text: 'I’m currently looking for men to start a men’s group with.', label: 'Join a men’s group', href: MEN.url },
        ],
      },
    ],
  },
  {
    name: 'Stories',
    topics: ['family'],
    interests: ['stories'],
    line: 'Picture books and stories, to read or to listen to.',
    tile: { kind: 'Read · Listen', src: '/photos/airbnb-bearshark.jpg', alt: 'A bear-shark sculpture, half polar bear and half shark, suspended from the ceiling of an Airbnb office' },
    children: [
      {
        name: 'Foreside Fiasco',
        topics: ['family'],
        line: 'An unfortunate true story.',
        tile: { kind: 'Picture book · Read aloud', src: '/books/foreside-fiasco/cover-560.webp', position: 'center 35%' },
        link: '/foreside-fiasco/',
      },
      {
        name: 'The Golden Berry',
        topics: ['family'],
        line: 'By Jaya Elnora Peret, painted in watercolor by the Ukrainian artist Kateryna Rohotova.',
        tile: { kind: 'Picture book · By Jaya', src: '/books/golden-berry/cover-640.webp', position: 'center 30%' },
        link: '/golden-berry/',
      },
      {
        name: 'The Bear Shark',
        topics: ['family'],
        line: 'How a 12-foot bear shark got into the building.',
        tile: {
          kind: 'Story · Audio',
          src: '/photos/airbnb-bearshark.jpg',
          alt: 'A bear-shark sculpture, half polar bear and half shark, suspended from the ceiling of an Airbnb office',
        },
        link: '/photos/airbnb-bearshark.jpg',
        story: { title: 'The story of the bear shark', audio: '/stories/bear-shark.m4a', captions: '/stories/bear-shark.vtt' },
      },
    ],
  },
  {
    name: 'Family',
    topics: ['family'],
    interests: ['family'],
    line: 'Jaya, Fiona, Mackensie and the things we make together.',
    tile: { kind: 'Family', src: '/photos/family-beach.webp', alt: 'The family on the beach, the girls riding on our shoulders and waving', position: 'center 30%' },
    photos: [
      { src: '/photos/family-beach.webp', alt: 'The family on the beach, the girls riding on our shoulders and waving' },
      { src: '/photos/jaya-and-fiona.webp', alt: 'Jaya and Fiona in red dresses, side by side' },
    ],
    memories: [
      {
        title: 'Take a nap',
        audio: '/memories/take-a-nap.m4a',
        duration: '0:38',
        transcript: [
          '“Because I don’t have any stories when my nap comes up.”',
          '“Are you going to take a nap every day?” “Every single day.”',
          '“What if you don’t want to take a nap? What should you tell yourself?”',
          '“I should tell myself I have a very short nap.”',
          '“Okay. Even if you don’t want to?” “Even if I don’t want to. Do it anyways.”',
          '“Give us one story.” “Deal.”',
        ],
      },
      {
        title: 'Have to clean up',
        audio: '/memories/have-to-clean-up.m4a',
        duration: '0:24',
        transcript: [
          '“So, whenever we do something like Magna-Tiles, we have to clean it up.”',
          '“And when we do something like a pillow fort or anything like that, or even anything, we have to clean it up.”',
        ],
      },
    ],
    embed: 'https://jayaandfiona.com/',
    embedTitle: 'jayaandfiona.com, Jaya and Fiona’s Fun Zone',
    embedLast: true,
  },
];

// Smaller cards under a Projects heading, after the main ones.
export const projects: SectionData[] = [
  {
    name: 'HAUTomation',
    topics: ['personal'],
    line: 'A technical partner for custom, creative work.',
    tile: { kind: 'Home automation', src: '/tiles/hautomation.webp', alt: 'The HAUTomation site: “Your idea, wired in.” in white on rouge, beside a deck of keys' },
    link: 'https://hautomation.samperet.com',
  },
  {
    name: 'Streamdeck Hautomate',
    topics: ['personal'],
    line: 'A Stream Deck that plays your record collection.',
    tile: { kind: 'Project · Open source', src: '/tiles/streamdeck.webp', alt: 'A Stream Deck XL: genre keys on the left, an album cover cut across nine keys on the right', position: 'right center' },
    body: [
      'Our living room’s record shelf, on a Stream Deck. Every key is an album cover: tap one and it plays on the speaker through Home Assistant and Spotify. Genres open pages of covers, and whatever is playing spreads across nine keys, cropped around the gaps so it reads as one picture, with “artist – song” scrolling slowly underneath in large type.',
      'Volume is built to feel right: small steps when it’s quiet and bigger ones as it gets louder, slow taps fine-tune, a quick run of taps jumps, and holding slides all the way in three seconds, with the level drawn across the cover. Everyone in the house has their own folder they fill by voice (“add Kind of Blue to my folder”), and More holds a sleep timer, sound effects, karaoke on the TV, a Lights Out game and a music visualizer that turns the keys into a spectrum analyser.',
      'It works on the 32-key Stream Deck XL and the 15-key MK.2, and comes with a browser emulator, so you can try every page before you own a deck. It’s open source under the MIT licence; the setup guide walks through Home Assistant, Spotify and Docker.',
    ],
    links: [
      { label: 'The code and setup guide on GitHub', href: 'https://github.com/samperet/Streamdeck-Hautomate' },
    ],
    photos: [
      { src: '/streamdeck/xl-home.webp', alt: 'Home on the Stream Deck XL: genre keys, the playing album across nine keys and the scrolling line', caption: 'Home on the XL: genres, the cover across nine keys, and the scrolling line under it' },
      { src: '/streamdeck/xl-albums.webp', alt: 'A page of 24 album covers on the Stream Deck XL', caption: 'A genre: 24 covers a page' },
      { src: '/streamdeck/xl-volume.webp', alt: 'The volume level drawn in large numbers across the album cover', caption: 'The volume, drawn across the cover while it changes' },
      { src: '/streamdeck/xl-now-playing.webp', alt: 'The Now Playing page on the Stream Deck XL with the cover large', caption: 'Now Playing, after tapping an album' },
      { src: '/streamdeck/xl-more.webp', alt: 'The More page: amp, sleep, visualizer, TV, karaoke, sound effects, Lights Out and Random keys', caption: 'More: the amp, a sleep timer, the TV, karaoke, games and Random' },
      { src: '/streamdeck/mk2-home.webp', alt: 'Home on the 15-key Stream Deck', caption: 'The same deck on 15 keys' },
      { src: '/streamdeck/mk2-albums.webp', alt: 'A page of album covers on the 15-key Stream Deck', caption: 'A genre on 15 keys' },
      { src: '/streamdeck/mk2-now-playing.webp', alt: 'Now Playing on the 15-key Stream Deck with the cover across nine keys', caption: 'Now Playing on 15 keys' },
      { src: '/streamdeck/mk2-lights-out.webp', alt: 'The Lights Out game on the 15-key Stream Deck', caption: 'Lights Out: the whole deck is the board' },
    ],
  },
  {
    name: 'CommunityOS',
    topics: ['personal'],
    line: 'A free portal for communities that organize in circles.',
    tile: { kind: 'Project · Open source', src: '/tiles/common-pastures.webp', position: 'center 70%' },
    body: [
      'A community portal for groups that organize with circles, as in sociocracy: a directory of members and the circles they serve on, with open seats; proposals a circle consents to at a meeting, with who was there; shared documents, a forum, a calendar, a loan library and the skills neighbors offer.',
      'I built it for the Common Pastures community, and any other community is free to use it. If you’d like help setting it up for yours, reach out.',
    ],
    links: [{ label: 'The code on GitHub', href: 'https://github.com/samperet/CommonPasturesPortal' }],
    message: 'Ask about setting it up',
  },
  {
    name: 'Percentage Allocator',
    topics: ['personal'],
    line: 'Split any amount across line items, always adding up to 100%.',
    tile: { kind: 'App · Open source', src: '/tiles/percentcalc.webp', position: 'center top' },
    body: [
      'A small calculator for dividing a total: drag a slider and the other items rebalance, lock an item to hold its share, link items so they move together, and share the result as a link. It installs on a phone like an app and works offline.',
    ],
    links: [
      { label: 'Open the app', href: 'https://samperet.com/percentcalc/' },
      { label: 'The code on GitHub', href: 'https://github.com/samperet/percentcalc' },
    ],
    embed: '/percentcalc/index.html',
    embedTitle: 'Percentage Allocator, a calculator for splitting an amount',
    embedRatio: '4 / 3',
    embedAllow: 'clipboard-write',
  },
];

// The footer's cards: every recommended book (src/data/books.ts), and every photo on the site,
// gathered by the card or career chapter it appears in, each photo once.
const slug = (value: string) => value.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const seen = new Set<string>();
const photoParts: SectionData[] = [];
const gather = (name: string, photos: Photo[] = []) => {
  const fresh = photos.filter((p) => !seen.has(p.src) && seen.add(p.src));
  if (fresh.length) photoParts.push({ name, id: `photos-${slug(name)}`, photos: fresh });
};
for (const s of sections) {
  gather(s.name, s.photos);
  for (const part of s.parts ?? []) gather(part.name, part.photos);
}
gather('ALPS', ALPS_PHOTOS);
gather('Airbnb', AIRBNB_PHOTOS);

export const footerCards: SectionData[] = [
  { name: 'Recommended Books', tile: { color: 'var(--hackberry)' }, interests: 'all' },
  {
    name: 'Photos',
    tile: { src: '/travel/lava-flow-big-island.webp', alt: 'Two men throwing shakas at night in front of glowing red lava on the Big Island of Hawaiʻi' },
    parts: photoParts,
  },
];
