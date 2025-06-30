import { UTApi } from 'uploadthing/server';
import { prisma } from '../../prisma/prisma';
import { logger } from '@/utils/pino';
export async function deleteUTFile(
  videoId: string,
  userId: string,
  existingVideo: { thumbnailKey: string | null },
) {
  const utApi = new UTApi();

  try {
    const deleteUtFile = await utApi.deleteFiles(existingVideo.thumbnailKey as string); // ensure file is gone

    // Fire and forget the DB update
    if (!deleteUtFile.success) throw new Error('file deletion not successful');
    void prisma.video
      .update({
        where: { id: videoId, userId },
        data: { thumbnailKey: null },
      })
      .catch((err) => {
        logger.error('Failed to update DB after UT deletion:', err);
      });
  } catch (err) {
    logger.error('Failed to delete from UploadThing:', err);
  }
}
