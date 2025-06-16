'use client';

import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import PlaylistCreateModal from '../ui/components/PlaylistCreateModal';
import { useState } from 'react';
import PlaylistsSection from '../sections/PlaylistsSection';

function PlaylistsView() {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  return (
    <div className="mx-auto mb-10 flex max-w-[2400px] flex-col gap-y-6 px-4 pt-2.5">
      <PlaylistCreateModal open={createModalOpen} onOpenChange={setCreateModalOpen} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Playlists</h1>
          <p className="text-muted-foreground text-xs">Collections You Created</p>
        </div>
        <Button
          variant={'outline'}
          size={'icon'}
          className="rounded-full"
          onClick={() => {
            setCreateModalOpen(true);
          }}
        >
          <PlusIcon />
        </Button>
      </div>
      <PlaylistsSection />
    </div>
  );
}
export default PlaylistsView;
