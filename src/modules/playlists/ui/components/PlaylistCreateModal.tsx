import ResponsiveModal from '@/components/ResponsiveModal';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { trpc } from '@/trpc/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

interface PlaylistCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({ name: z.string().min(1) });

function PlaylistCreateModal({ onOpenChange, open }: PlaylistCreateModalProps) {
  const utils = trpc.useUtils();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '' },
  });

  const createPlaylist = trpc.playlists.create.useMutation({
    onSuccess: () => {
      form.reset();
      utils.playlists.getMany.invalidate();
      onOpenChange(false);
      toast.success('Playlist Created');
    },
    onError: () => {
      toast.success('something went wrong');
    },
  });
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createPlaylist.mutate({ name: values.name });
  };

  return (
    <ResponsiveModal open={open} title={'Create a playlist'} onOpenChange={onOpenChange}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Playlist name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button disabled={createPlaylist.isPending} type="submit">
              Create
            </Button>
          </div>
        </form>
      </Form>
    </ResponsiveModal>
  );
}
export default PlaylistCreateModal;
