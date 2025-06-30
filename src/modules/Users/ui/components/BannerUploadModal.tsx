'use client';

import ResponsiveModal from '@/components/ResponsiveModal';
import { trpc } from '@/trpc/client';
import { logger } from '@/utils/pino';
import { UploadDropzone } from '@/utils/uploadthing';

interface BannerUploadModalProps {
  userId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function BannerUploadModal({ onOpenChange, open, userId }: BannerUploadModalProps) {
  const utils = trpc.useUtils();

  const onClientUploadComplete = () => {
    onOpenChange(false);
    utils.studio.getMany.invalidate();
    utils.users.getOne.invalidate({ userId });
  };

  return (
    <ResponsiveModal title="Upload a Banner" open={open} onOpenChange={onOpenChange}>
      <UploadDropzone
        endpoint="bannerUploader"
        onUploadBegin={() => {
          logger.info('Upload started');
        }}
        onClientUploadComplete={onClientUploadComplete}
      />
    </ResponsiveModal>
  );
}
export default BannerUploadModal;
