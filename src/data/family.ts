// The family page (src/pages/family.astro), at family.samperet.com: unlisted, so nothing here is
// linked from samperet.com or told to Merlin. Photos open in the viewer; memories are recordings
// with their transcripts.
import type { Photo } from './photos';

export const FAMILY_PAGE: {
  line: string;
  photos: Photo[];
  memories: { title: string; audio: string; duration: string; transcript: string[] }[];
} = {
  line: 'Jaya, Fiona, Mackensie and the things we make together.',
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
};
