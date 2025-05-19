'use client';

import ResponsiveModal from '@/components/ResponsiveModal';
import { trpc } from '@/trpc/client';
import { UploadDropzone } from '@/utils/uploadthing';

interface ThumbnailUploadModalProps {
  videoId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function ThumbnailUploadModal({ onOpenChange, open, videoId }: ThumbnailUploadModalProps) {
  const utils = trpc.useUtils();

  const onClientUploadComplete = () => {
    onOpenChange(false);
    utils.studio.getMany.invalidate();
    utils.studio.getOne.invalidate({ id: videoId });
  };

  return (
    <ResponsiveModal title="Upload a thumbnail" open={open} onOpenChange={onOpenChange}>
      <UploadDropzone
        input={{ videoId }}
        endpoint="thumbnailUploader"
        onUploadBegin={() => {
          console.log('Upload started');
        }}
        onClientUploadComplete={onClientUploadComplete}
      />
    </ResponsiveModal>
  );
}
export default ThumbnailUploadModal;
