import { env } from '@/data/server';
import Mux from '@mux/mux-node';

export const mux = new Mux({
  tokenId: env.MUX_TOKEN_ID,
  tokenSecret: env.MUX_TOKEN_SECRET,
});


export async function deleteMuxVideo(assetId: string) {
  try {
    await mux.video.assets.delete(assetId);
    console.log(`Deleted Mux video: ${assetId}`);
  } catch (error) {
    console.error('Failed to delete Mux video:', error);
  }
}