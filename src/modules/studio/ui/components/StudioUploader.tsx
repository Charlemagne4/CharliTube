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
  return (
    <div>
      <MuxUploader endpoint={endpoint} />
    </div>
  );
}
export default StudioUploader;
