import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    DISCORD_CLIENT_ID: z.string().min(1),
    DISCORD_CLIENT_SECRET: z.string().min(1),
    GITHUB_CLIENT_ID: z.string().min(1),
    GITHUB_CLIENT_SECRET: z.string().min(1),
    OAUTH_REDIRECT_URL_BASE: z.string().url(),
    AUTH_SECRET: z.string().min(1), //"npx auth secret" to create one
    NEXTAUTH_URL: z.string().min(1),
    UPSTASH_REDIS_REST_URL: z.string().url(),
    UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
    MUX_TOKEN_ID: z.string(),
    MUX_TOKEN_SECRET: z.string(),
    MUX_WEBHOOK_SECRET: z.string(),
    UPLOADTHING_TOKEN: z.string(),
    QSTASH_URL: z.string().url(),
    QSTASH_TOKEN: z.string(),
    QSTASH_CURRENT_SIGNING_KEY: z.string(),
    QSTASH_NEXT_SIGNING_KEY: z.string(),
    UPSTASH_WORKFLOW_URL: z.string().url(),
    CO_API_KEY: z.string(),
    DEEPSEEK_API_KEY: z.string(),
  },
  client: {},

  // For Next.js >= 13.4.4, you only need to destructure client variables:
  experimental__runtimeEnv: {},
});
