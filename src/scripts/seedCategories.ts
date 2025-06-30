// scripts/seedCategories.ts

import { logger } from '@/utils/pino.js';
import { PrismaClient } from '../../generated/prisma/index.js';

const prisma = new PrismaClient();

const categoryNames = [
  'Cars and vehicles',
  'Comedy',
  'Education',
  'Gaming',
  'Entertainment',
  'Film and animation',
  'How-to and style',
  'Music',
  'News and politics',
  'People and blogs',
  'Pets and animals',
  'Science and technology',
  'Sports',
  'Travel and events',
];

async function main() {
  for (const name of categoryNames) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: {
        name,
        description: `${name} related videos`,
      },
    });
  }
  logger.info('✅ Categories seeded.');
}

main()
  .catch((e) => {
    logger.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
