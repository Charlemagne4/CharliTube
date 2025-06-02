import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import UserAvatar from '@/components/UserAvatar';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { VideoCommentCreateSchema } from '../../../../../prisma/zod-prisma';
import { trpc } from '@/trpc/client';
import { useRouter } from 'next/navigation';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';

interface CommentFormProps {
  videoId: string;
  parentId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  variant?: 'reply' | 'comment';
}
function CommentForm({
  videoId,
  onSuccess,
  onCancel,
  parentId,
  variant = 'comment',
}: CommentFormProps) {
  const { data: session, status } = useSession();
  const utils = trpc.useUtils();
  const router = useRouter();
  const createComment = trpc.comments.create.useMutation({
    onSuccess: () => {
      utils.comments.getMany.invalidate({ videoId });
      toast.success('Comment Submitted.');
      form.reset();
      onSuccess?.();
    },
    onError: (error) => {
      toast.error('something went wrong.');
      if (error.data?.code === 'UNAUTHORIZED') {
        router.push('/signin');
      }
    },
  });
  const form = useForm<z.infer<typeof VideoCommentCreateSchema>>({
    resolver: zodResolver(VideoCommentCreateSchema.omit({ userId: true })),
    defaultValues: {
      parentId,
      content: '',
      videoId,
    },
  });

  function handleSubmit(data: z.infer<typeof VideoCommentCreateSchema>) {
    createComment.mutate(data);
  }

  if (status === 'loading') {
    return <span>loading User...</span>;
  }

  function handleCancel(): void {
    form.reset();
    onCancel?.();
  }

  return (
    <Form {...form}>
      <form className="group flex gap-4" onSubmit={form.handleSubmit(handleSubmit)}>
        <UserAvatar size={'lg'} imageUrl={session?.user?.image} name={session?.user?.name} />
        <div className="flex-1">
          <FormField
            name="content"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder={
                      variant === 'reply' ? `Reply to this comment...` : 'Add a comment...'
                    }
                    className="min-h-0 resize-none overflow-hidden bg-transparent"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="mt-2 flex justify-end">
            {onCancel && (
              <Button variant={'ghost'} type="button" onClick={handleCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" size={'sm'}>
              {variant === 'reply' ? 'Reply' : 'Comment'}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
export default CommentForm;
