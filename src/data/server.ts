import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    CLERK_SECRET_KEY: z.string(),
    DISCORD_CLIENT_ID: z.string().min(1),
    DISCORD_CLIENT_SECRET: z.string().min(1),
    GITHUB_CLIENT_ID: z.string().min(1),
    GITHUB_CLIENT_SECRET: z.string().min(1),
    OAUTH_REDIRECT_URL_BASE: z.string().url(),
    AUTH_SECRET: z.string().min(1) //"npx auth secret" to create one
  },
  client: {},

  // For Next.js >= 13.4.4, you only need to destructure client variables:
  experimental__runtimeEnv: {}
});
