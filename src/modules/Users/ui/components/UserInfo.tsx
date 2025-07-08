import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const nameFallback = 'Jean Michelle Bruitage';

const UserinfoVariants = cva('flex items-center gap-1', {
  variants: {
    size: {
      default: '[&_p]:text-sm [&_svg]:size-4',
      lg: '[&_p]:text-base [&_svg]:size-5 [&_p]:font-medium [&_p]:text-foreground',
      sm: '[&_p]:text-xs [&_svg]:size-3.5',
    },
  },
  defaultVariants: { size: 'default' },
}); 
interface UserInfoProps extends VariantProps<typeof UserinfoVariants> {
  name: string | null | undefined;
  className?: string;
}
function UserInfo({ name = nameFallback, className, size }: UserInfoProps) {
  return (
    <div className={cn(UserinfoVariants({ size, className }))}>
      <Tooltip>
        <TooltipTrigger asChild>
          <p className="text-foreground/80 hover:text-foreground/40 line-clamp-1">{name}</p>
        </TooltipTrigger>
        <TooltipContent align="center" className="bg-foreground/70">
          <p>{name}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
export default UserInfo;
