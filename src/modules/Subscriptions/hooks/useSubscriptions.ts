import useRedirectToSignIn from '@/modules/auth/ui/components/useRedirectToSignIn';
import { trpc } from '@/trpc/client';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

interface useSubscriptionsProps {
  userId: string;
  //   isSubscribed: boolean | null;
  fromVideoId?: string;
}

function useSubscriptions({ userId, fromVideoId }: useSubscriptionsProps) {
  const redirectToSignIn = useRedirectToSignIn();

  const { data: session, status } = useSession();

  const { data: isSubscribed } = trpc.subscriptions.getOne.useQuery({
    userId,
  });
  const utils = trpc.useUtils();
  //TODO: reinvalidate subscriptions.getMany, users.getOne
  const subscribe = trpc.subscriptions.create.useMutation({
    onSuccess: () => {
      utils.subscriptions.getOne.invalidate({ userId });
      utils.videos.getOne.invalidate({ videoId: fromVideoId });
      utils.videos.getManySubscribed.invalidate();
      utils.users.getOne.invalidate({ userId });
      utils.subscriptions.getMany.invalidate();

      if (fromVideoId) {
        utils.videos.getOne.invalidate();
      }

      toast.success('Subscribed');
    },
    onError: (error) => {
      toast.error('something Went Wrong');
      if (error.data?.code === 'UNAUTHORIZED') {
        redirectToSignIn();
      }
    },
  });
  const unsubscribe = trpc.subscriptions.remove.useMutation({
    onSuccess: () => {
      utils.subscriptions.getOne.invalidate({ userId });
      utils.videos.getOne.invalidate({ videoId: fromVideoId });
      utils.videos.getManySubscribed.invalidate();
      utils.users.getOne.invalidate({ userId });
      utils.subscriptions.getMany.invalidate();

      if (fromVideoId) {
        utils.videos.getOne.invalidate();
      }

      toast.success('Unsubscribed');
    },
    onError: (error) => {
      toast.error('something Went Wrong');
      if (error.data?.code === 'UNAUTHORIZED') {
        redirectToSignIn();
      }
    },
  });

  const isPending = subscribe.isPending || unsubscribe.isPending;
  const onClick = () => {
    if (isSubscribed) {
      unsubscribe.mutate({ userId });
    } else {
      subscribe.mutate({ userId });
    }
  };
  return {
    isPending,
    onClick,
    status,
    isSubscribed,
    session,
  };
}
export default useSubscriptions;
