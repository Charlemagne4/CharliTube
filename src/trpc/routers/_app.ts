import { studioRouter } from '@/modules/studio/server/procedures';
import { createTRPCRouter } from '../init';

import { categoriesRouter } from '@/modules/categories/server/procedures';
import { videosRouter } from '@/modules/videos/server/procedures';
import { videoViewsRouter } from '@/modules/videoViews/server/procedure';

export const appRouter = createTRPCRouter({
  studio: studioRouter,
  categories: categoriesRouter,
  videos: videosRouter,
  views: videoViewsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
