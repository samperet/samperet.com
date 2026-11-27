// The family page (src/pages/family.astro), at family.samperet.com: unlisted, so nothing here is
// linked from samperet.com or told to Merlin. Photos open in the viewer; memories are recordings
// with their transcripts, or a note for a song.
import type { Memory } from '../components/Memories.astro';
import type { Photo } from './photos';

export const FAMILY_PAGE: {
  line: string;
  photos: Photo[];
  memories: Memory[];
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
    {
      title: 'You Belong With Me',
      audio: '/memories/you-belong-with-me.m4a',
      duration: '1:10',
      note: 'Fiona sings Taylor Swift’s song.',
    },
    {
      title: 'Jaya’s story',
      audio: '/memories/jaya-story.m4a',
      duration: '3:34',
      transcript: [
        '“Once upon a time, there was a princess, and that princess, her name was Elizabeth. And she loved gardening, and she made her own pepper plant all by herself. And she was only five and a half.”',
        '“And when she went in for dinner, her dinner was macaroni and cheese. And when she woke up the next day, she saw the teddy bear that she saw every morning waiting for her. And it could talk.”',
        '“So she went to it in the morning. She had her breakfast. Her breakfast was pancakes, with her little sister, Jane. So with her little sister, she pushed her little sister in the stroller to the teddy bear, and she picked the teddy bear up and put the teddy bear in the stroller in the back seat.”',
        '“And then they went for a walk with her mommy, and she hided the teddy bear under a blankie. So she went back home, and then she rided on her pony. And then she saw a cheetah and an elephant, because they lived in California.”',
        '“And then it was the day of Christmas, the day before Christmas. So she was so excited. So Janie and her and the princess Elizabeth got into their beds. And then, when they woke up the next morning, they went to get the presents. And the teddy got a big, big, big box with salmon in it. And Elizabeth got her own phone. And Janie got a little grocery shopper cart.”',
        '“And she watered her plants all day today. And then it was nighttime again. And then… she woke up the next morning. The end.”',
      ],
    },
  ],
};
