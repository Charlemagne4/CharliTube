import { AppRouter } from '@/trpc/routers/_app';
import { inferRouterOutputs } from '@trpc/server';

export type playlistGetManyOutput = inferRouterOutputs<AppRouter>['playlists']['getMany'];
