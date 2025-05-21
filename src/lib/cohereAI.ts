import { env } from '@/data/server';
import { CohereClientV2 } from 'cohere-ai';

const cohere = new CohereClientV2({ token: env.CO_API_KEY });

export const promptCohereAI = async (prompt: string, additionalContent: string | null = null) => {
  const response = await cohere.chat({
    model: 'command-a-03-2025',
    // can send content being an array
    ...(additionalContent && additionalContent.length > 0
      ? {
          messages: [
            { role: 'user', content: prompt },
            { role: 'user', content: additionalContent },
          ],
        }
      : { messages: [{ role: 'user', content: prompt }] }),
  });
  const AIresponse = response?.message?.content?.[0].text;
  console.log(AIresponse);
  return AIresponse;
};
