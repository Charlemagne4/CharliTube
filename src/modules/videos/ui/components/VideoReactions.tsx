import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { ThumbsDownIcon, ThumbsUpIcon } from 'lucide-react';

function VideoReactions() {
  const liked = true;
  //TODO: properly implement Video reactions
  return (
    <div className="flex flex-none items-center">
      <Button className="gap-2 rounded-l-full rounded-r-none pr-4" variant={'secondary'}>
        <ThumbsUpIcon className={cn('size-5', liked && 'fill-black')} />
        {1}
      </Button>
      <Separator orientation="vertical" className="h-7" />
      <Button className="rounded-l-none rounded-r-full pl-3" variant={'secondary'}>
        <ThumbsDownIcon className={cn('size-5', !liked && 'fill-black')} />
        {1}
      </Button>
    </div>
  );
}
export default VideoReactions;
