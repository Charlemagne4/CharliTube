import { env } from '@/data/server';
import { Client } from '@upstash/workflow';

export const workflowUpstashClient = new Client({ token: env.QSTASH_TOKEN! });
