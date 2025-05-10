import { baseProcedure, createTRPCRouter } from '@/trpc/init';
import { prisma } from '../../../../prisma/prisma';

export const categoriesRouter = createTRPCRouter({
  getMany: baseProcedure.query(async () => {
    const data = await prisma.category.findMany();
    // console.log('Categories fetched:', data);
    return data;
  })
});
