import { getServerSession } from 'next-auth';
import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';
import { z } from 'zod';
import { prisma } from '../../../../prisma/prisma';
import { deleteUTFile } from '@/lib/UTapi';

const f = createUploadthing();

//

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  thumbnailUploader: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: '4MB',
      maxFileCount: 1
    }
  })
    .input(z.object({ videoId: z.string() }))
    .middleware(async ({ input }) => {
      const auth = await getServerSession();
      const user = auth?.user;

      if (!user) throw new UploadThingError('Unauthorized');
      const { id: userId } = user;
      const existingVideo = await prisma.video.findFirst({
        where: { id: input.videoId, userId },
        select: { thumbnailKey: true }
      });

      if (!existingVideo) throw new UploadThingError('Not Found');

      if (existingVideo.thumbnailKey) {
        await deleteUTFile(input.videoId, userId, existingVideo);
      }

      return { userId: user.id, ...input };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload

      await prisma.video.update({
        where: { id: metadata.videoId, userId: metadata.userId },
        data: { thumbnailUrl: file.ufsUrl, thumbnailKey: file.key }
      });
      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };
    })
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
