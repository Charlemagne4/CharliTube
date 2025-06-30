import { serve } from '@upstash/workflow/nextjs';
import { Receiver } from '@upstash/qstash';
import { env } from '@/data/server';
import { prisma } from '../../../../../../prisma/prisma';
import { promptCohereAI } from '@/lib/cohereAI';
import { titlePrompt } from '../../../../../../public/system_prompts';
import { logger } from '@/utils/pino';

interface InputType {
  userId: string;
  videoId: string;
}

export const { POST } = serve(
  async (context) => {
    logger.info('Context inside route title.');
    const input = context.requestPayload as InputType;
    const { userId, videoId } = input;

    const existingVideo = await context.run('get-video', async () => {
      logger.info('>>>get-video ran once');
      const data = await prisma.video.findFirst({ where: { id: videoId, userId } });
      if (!data) throw new Error('Not found');
      return data;
    });

    await context.run('update-video', async () => {
      logger.info('>>>update-video ran once');

      if (!existingVideo?.description) return 'no title found';

      const generatedTitle = await promptCohereAI(titlePrompt(existingVideo.description));
      if (!generatedTitle) return 'could not generate title';

      const data = await prisma.video.update({
        where: { id: videoId, userId },
        data: { title: generatedTitle },
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
