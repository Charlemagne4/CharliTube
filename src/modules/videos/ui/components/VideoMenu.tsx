import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { ShadcnButtonProps } from '@/modules/Subscriptions/ui/components/SubscriptionButton';
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { ListPlusIcon, MoreVerticalIcon, ShareIcon, Trash2Icon } from 'lucide-react';
import { toast } from 'sonner';

interface VideoMenuProps {
  videoId: string;
  variant?: ShadcnButtonProps['variant'];
  onRemove?: () => void;
}

//TODO: video menu features
function VideoMenu({ videoId, onRemove, variant = 'ghost' }: VideoMenuProps) {
  function onShare() {
    const fullUrl = `${process.env.VERCEL_URL || 'http://localhost:3000'}/videos/${videoId}`;
    navigator.clipboard.writeText(fullUrl);
    toast.success('Link copied to clipboard');
  }
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={'icon'} className="rounded-full">
          <MoreVerticalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
        <DropdownMenuItem onClick={onShare}>
          <ShareIcon className="mr-2 size-4" />
          Share
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => {}}>
          <ListPlusIcon className="mr-2 size-4" />
          Add to playlist
        </DropdownMenuItem>
        {onRemove && (
          <DropdownMenuItem onClick={() => {}}>
            <Trash2Icon className="mr-2 size-4" />
            Remove
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export default VideoMenu;
