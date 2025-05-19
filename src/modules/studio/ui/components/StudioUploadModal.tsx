'use client';

import ResponsiveModal from '@/components/ResponsiveModal';
import { Button } from '@/components/ui/button';
import { trpc } from '@/trpc/client';
import { Loader2Icon, PlusIcon } from 'lucide-react';
import { toast } from 'sonner';
import StudioUploader from './StudioUploader';
import { useRouter } from 'next/navigation';

function StudioUploadModal() {
  const router = useRouter();
  const utils = trpc.useUtils();
  const create = trpc.videos.create.useMutation({
    onSuccess: () => {
      toast.success('Video Created');
      utils.studio.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  function onSuccess() {
    if (!create.data?.video.id) return;
    create.reset();
    router.push(`/studio/videos/${create.data.video.id}`);
  }

  return (
    <>
      <ResponsiveModal
        title="Upload a video"
        open={!!create.data?.url}
        onOpenChange={() => {
          create.reset();
        }}
      >
        {create.data?.url ? (
          <StudioUploader onSuccess={onSuccess} endpoint={create.data.url} />
        ) : (
          <Loader2Icon />
        )}
      </ResponsiveModal>
      <Button variant={'secondary'} onClick={() => create.mutate()} disabled={create.isPending}>
        {create.isPending ? <Loader2Icon className="animate-spin" /> : <PlusIcon />}
        Create
      </Button>
    </>
  );
}
export default StudioUploadModal;
