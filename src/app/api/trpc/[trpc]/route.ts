import { createTRPCContext } from '@/trpc/init';
import { appRouter } from '@/trpc/routers/_app';

import { createNextApiHandler } from '@trpc/server/adapters/next';
// import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

// const handler = (req: Request) =>
//   fetchRequestHandler({
//     endpoint: '/api/trpc',
//     req,
//     router: appRouter,
//     createContext: createTRPCContext
//   });

const handler = createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext
});
export { handler as GET, handler as POST };
