import Link from 'next/link';
import { CommentGetManyOutput } from '../../types';
import UserAvatar from '@/components/UserAvatar';
import { formatDistanceToNow } from 'date-fns';
import { trpc } from '@/trpc/client';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  MessageSquareIcon,
  MoreVerticalIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  Trash2Icon,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface CommentItemProps {
  comment: CommentGetManyOutput['items'][number];
}

function CommentItem({ comment }: CommentItemProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const utils = trpc.useUtils();
  const remove = trpc.comments.remove.useMutation({
    onSuccess: () => {
      toast.success('Comment deleted');
      utils.comments.getMany.invalidate({ videoId: comment.videoId });
    },
    onError: (error) => {
      toast.error('Something went wrong.');
      if (error.data?.code === 'UNAUTHORIZED') {
        router.push('/signin');
      }
    },
  });
  const like = trpc.commentReactions.like.useMutation({
    onSuccess: () => {
      utils.comments.getMany.invalidate({ videoId: comment.videoId });
      // toast.success('comment liked');
    },
    onError: (error) => {
      toast.error('something went wrong');
      if (error.data?.code === 'UNAUTHORIZED') router.push('/signin');
    },
  });
  const dislike = trpc.commentReactions.dislike.useMutation({
    onSuccess: () => {
      utils.comments.getMany.invalidate({ videoId: comment.videoId });
      // toast.success('comment disliked');
    },
    onError: (error) => {
      toast.error('something went wrong');
      if (error.data?.code === 'UNAUTHORIZED') router.push('/signin');
    },
  });

  const { user } = comment;
  return (
    <div>
      <div className="flex gap-4">
        <Link href={`/users/${comment.userId}`}>
          <UserAvatar imageUrl={user.image} name={user.name} size={'lg'} />
        </Link>
        <div className="min-w-0 flex-1">
          <Link href={`/users/${comment.userId}`}>
            <div className="mb-0.5 flex items-center gap-2">
              <span className="pb-0.5 text-sm font-medium">{user.name}</span>
              <span className="text-muted-foreground text-xs">
                <time
                  dateTime={comment.createdAt.toISOString()}
                  className="text-muted-foreground text-xs"
                >
                  {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                </time>
              </span>
            </div>
          </Link>
          <p className="text-sm">{comment.content}</p>
          <div className="mt-1 flex items-center gap-2">
            <div className="flex items-center">
              <Button
                className="size-8"
                size={'icon'}
                variant={'ghost'}
                onClick={() => {
                  like.mutate({ commentId: comment.id });
                }}
                disabled={like.isPending}
              >
                <ThumbsUpIcon className={cn(comment.hasLiked && 'fill-black')} />
              </Button>
              <span className="text-muted-foreground text-xs">{comment.likeCount}</span>
              <Button
                className="size-8"
                size={'icon'}
                variant={'ghost'}
                onClick={() => {
                  dislike.mutate({ commentId: comment.id });
                }}
                disabled={dislike.isPending}
              >
                <ThumbsDownIcon className={cn(comment.hasDisliked && 'fill-black')} />
              </Button>
              <span className="text-muted-foreground text-xs">{comment.dislikeCount}</span>
            </div>
          </div>
        </div>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant={'ghost'} size={'icon'} className="size-8">
              <MoreVerticalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => {}}>
              <MessageSquareIcon className="size-4" />
              Reply
            </DropdownMenuItem>
            {comment.userId === session?.user.id && (
              <DropdownMenuItem
                onClick={() => {
                  remove.mutate({ commentId: comment.id });
                }}
              >
                <Trash2Icon className="size-4" />
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
export default CommentItem;
