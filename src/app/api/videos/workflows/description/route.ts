import { serve } from '@upstash/workflow/nextjs';
import { Receiver } from '@upstash/qstash';
import { env } from '@/data/server';
import { prisma } from '../../../../../../prisma/prisma';
import { promptCohereAI } from '@/lib/cohereAI';
import { descriptionPrompt } from '../../../../../../public/system_prompts';
import { logger } from '@/utils/pino';

interface InputType {
  userId: string;
  videoId: string;
}

export const { POST } = serve(
  async (context) => {
    logger.info('Context inside route description.');
    const input = context.requestPayload as InputType;
    const { userId, videoId } = input;

    //commented this out because the next step will call the db either way,
    //  but if not can be used as data already fetch.
    const existingVideo = await context.run('get-video', async () => {
      logger.info('>>>get-video ran once');
      const data = await prisma.video.findFirst({ where: { id: videoId, userId } });
      if (!data) throw new Error('Not found');
      return data;
    });

    await context.run('update-video', async () => {
      logger.info('>>>update-video ran once');

      if (!existingVideo?.title) return 'no title found';

      const generatedDescription = await promptCohereAI(descriptionPrompt(existingVideo.title));
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
