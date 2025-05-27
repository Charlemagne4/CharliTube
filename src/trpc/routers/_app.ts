import { studioRouter } from '@/modules/studio/server/procedures';
import { createTRPCRouter } from '../init';

import { categoriesRouter } from '@/modules/categories/server/procedures';
import { videosRouter } from '@/modules/videos/server/procedures';
import { videoViewsRouter } from '@/modules/videoViews/server/procedure';
import { VideoReactionsRouter } from '@/modules/videoReactions/server/procedure';
import { subscriptionsRouter } from '@/modules/Subscriptions/server/procedure';

export const appRouter = createTRPCRouter({
  studio: studioRouter,
  categories: categoriesRouter,
  videos: videosRouter,
  views: videoViewsRouter,
  reactions: VideoReactionsRouter,
  subscriptions: subscriptionsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
