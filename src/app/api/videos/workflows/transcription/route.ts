import { serve } from '@upstash/workflow/nextjs';
import { Receiver } from '@upstash/qstash';
import { env } from '@/data/server';
import { prisma } from '../../../../../../prisma/prisma';
import { promptCohereAI } from '@/lib/cohereAI';
import { DESCRIPTION_SYSTEM_PROMPT } from '../../../../../../public/system_prompts';

interface InputType {
  userId: string;
  videoId: string;
}

export const { POST } = serve(
  async (context) => {
    console.log('Context inside route transcription.');
    const input = context.requestPayload as InputType;
    const { userId, videoId } = input;

    //commented this out because the next step will call the db either way,
    //  but if not can be used as data already fetch.
    const existingVideo = await context.run('get-video', async () => {
      console.log('>>>get-video ran once');
      const data = await prisma.video.findFirst({ where: { id: videoId, userId } });
      if (!data) throw new Error('Not found');
      return data;
    });

    const transcript = await context.run('get-transcript', async () => {
      const trackUrl = `https://stream.mux.com/${existingVideo.muxPlaybackId}/text/${existingVideo.muxTrackId}.txt`;
      const response = await fetch(trackUrl);
      const text = response.text();
      if (!text) throw new Error('Bad request');
      return text;
    });

    await context.run('update-video', async () => {
      console.log('>>>update-video ran once');

      if (!existingVideo?.muxTrackId) return 'no transcription found';

      const generatedDescription = await promptCohereAI(DESCRIPTION_SYSTEM_PROMPT, transcript);
      if (!generatedDescription) return 'could not generate description';

      const data = await prisma.video.update({
        where: { id: videoId, userId },
        data: { description: generatedDescription },
      });
      if (!data) throw new Error('Not found');
      return data;
    });
  },
  {
    receiver: new Receiver({
      currentSigningKey: env.QSTASH_CURRENT_SIGNING_KEY,
      nextSigningKey: env.QSTASH_NEXT_SIGNING_KEY,
    }),
  },
);
