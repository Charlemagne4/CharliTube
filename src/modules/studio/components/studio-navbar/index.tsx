import { SidebarTrigger } from '@/components/ui/sidebar';
import Image from 'next/image';
import Link from 'next/link';

import AuthButton from '@/modules/auth/ui/components/AuthButton';
import StudioUploadModal from '../StudioUploadModal';

export default function StudioNavbar() {
  return (
    <nav className="fixed top-0 right-0 left-0 z-50 flex h-16 items-center border-b bg-white ps-2 pr-5 shadow-md">
      <div className="flex w-full items-center gap-4">
        {/* Menu and logo */}
        <div className="flex shrink-0 items-center">
          <SidebarTrigger />
          <Link href={'/studio'}>
            <div className="flex items-center gap-1 p-4">
              <Image alt="Logo" src={'/logo.svg'} width={32} height={32} />
              <p className="text-xl font-semibold tracking-tight">Studio</p>
            </div>
          </Link>
        </div>
        <div className="flex-1" />
        <div className="flex shrink-0 items-center gap-4">
          <StudioUploadModal />
          <AuthButton />
        </div>
      </div>
    </nav>
  );
}
