import Link from 'next/link';
import { CommentGetManyOutput } from '../../types';
import UserAvatar from '@/components/UserAvatar';
import { formatDistanceToNow } from 'date-fns';

interface CommentItemProps {
  comment: CommentGetManyOutput[number];
}

function CommentItem({ comment }: CommentItemProps) {
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
                {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
              </span>
            </div>
          </Link>
          <p className="text-sm">{comment.content}</p>
        </div>
      </div>
    </div>
  );
}
export default CommentItem;
