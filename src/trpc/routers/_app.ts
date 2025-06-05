import { createTRPCRouter } from '../init';

import { videosRouter } from '@/modules/videos/server/procedures';
import { studioRouter } from '@/modules/studio/server/procedures';
import { categoriesRouter } from '@/modules/categories/server/procedures';
import { videoViewsRouter } from '@/modules/videoViews/server/procedure';
import { suggestionsRouter } from '@/modules/Suggestion/server/procedure';
import { subscriptionsRouter } from '@/modules/Subscriptions/server/procedure';
import { videoCommentsRouter } from '@/modules/comments/server/procedure';
import { VideoReactionsRouter } from '@/modules/videoReactions/server/procedure';
import { CommentReactionsRouter } from '@/modules/commentReactions/server/procedure';

export const appRouter = createTRPCRouter({
  studio: studioRouter,
  categories: categoriesRouter,
  videos: videosRouter,
  views: videoViewsRouter,
  reactions: VideoReactionsRouter,
  subscriptions: subscriptionsRouter,
  comments: videoCommentsRouter,
  commentReactions: CommentReactionsRouter,
  suggestions: suggestionsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
