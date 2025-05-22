import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ComponentProps } from 'react';

export type ShadcnButtonProps = ComponentProps<typeof Button>;

interface SubscriptionButtonProps {
  //this is wizardry that i do not fully understand
  onClick: ShadcnButtonProps['onClick'];
  disabled: boolean;
  isSubscribed: boolean;
  className?: string;
  size?: ShadcnButtonProps['size'];
}
function SubscriptionButton({
  disabled,
  isSubscribed,
  onClick,
  className,
  size,
}: SubscriptionButtonProps) {
  return (
    <Button
      className={cn('rounded-full', className)}
      size={size}
      variant={isSubscribed ? 'secondary' : 'default'}
      onClick={onClick}
      disabled={disabled}
    >
      {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
    </Button>
  );
}
export default SubscriptionButton;
