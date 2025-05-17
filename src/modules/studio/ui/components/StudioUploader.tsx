import { Button } from '@/components/ui/button';
import { UploadIcon } from 'lucide-react';

import MuxUploader, {
  MuxUploaderDrop,
  MuxUploaderFileSelect,
  MuxUploaderProgress,
  MuxUploaderStatus
} from '@mux/mux-uploader-react';

interface StudioUploaderProps {
  endpoint?: string;
  onSuccess: () => void;
}

function StudioUploader({ onSuccess, endpoint }: StudioUploaderProps) {
  const UPLOADER_ID = 'video-uploader';
  return (
    <div className="relative">
      {/* Hidden uploader element */}
      <MuxUploader onSuccess={onSuccess} endpoint={endpoint} id={UPLOADER_ID} className="hidden" />

      {/* Drop zone with visual feedback */}
      <MuxUploaderDrop
        muxUploader={UPLOADER_ID}
        className="group border-muted-foreground hover:border-primary hover:bg-muted flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-all"
      >
        <div slot="heading" className="flex flex-col items-center gap-6">
          <div className="bg-muted flex h-32 w-32 items-center justify-center rounded-full">
            <UploadIcon className="text-foreground size-10 transition-all duration-300 hover:animate-bounce" />
          </div>
          <div className="flex flex-col gap-2 text-center">
            <p className="text-muted-foreground text-sm">Drag and drop a video file</p>
            <p className="text-muted-foreground text-xs">
              Your videos will be private until you publish them
            </p>
          </div>
          <MuxUploaderFileSelect muxUploader={UPLOADER_ID}>
            <Button type="button" className="rounded-full">
              Select Files
            </Button>
          </MuxUploaderFileSelect>
        </div>
        <span slot="separator" className="hidden" />
        <MuxUploaderStatus muxUploader={UPLOADER_ID} className="text-sm" />
        <MuxUploaderProgress muxUploader={UPLOADER_ID} className="text-sm" type="percentage" />
        <MuxUploaderProgress muxUploader={UPLOADER_ID} type="bar" />
      </MuxUploaderDrop>
    </div>
  );
}
export default StudioUploader;
