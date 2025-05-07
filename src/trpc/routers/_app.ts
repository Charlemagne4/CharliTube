import { z } from 'zod';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { baseProcedure, createTRPCRouter, protectedProcedure } from '../init';

export const appRouter = createTRPCRouter({
  hello: protectedProcedure
    .input(
      z.object({
        text: z.string()
      })
    )
    .query((opts) => {
      console.log(opts.ctx.user);
      return {
        greeting: `${opts.input.text}`
      };
    })
});

// export type definition of API
export type AppRouter = typeof appRouter;
