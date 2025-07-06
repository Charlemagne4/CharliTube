import { SidebarTrigger } from '@/components/ui/sidebar';
import Image from 'next/image';
import Link from 'next/link';
import SearchInput from './SearchInput';
import AuthButton from '@/modules/auth/ui/components/AuthButton';

export default function HomeNavbar() {
  return (
    <nav className="fixed top-0 bg-background/80 right-0 left-0 z-50 flex h-16 items-center ps-2 pr-5">
      <div className="flex w-full items-center gap-4">
        {/* Menu and logo */}
        <div className="flex shrink-0 items-center">
          <SidebarTrigger />
          <Link prefetch href={'/'} className="hidden md:block">
            <div className="flex items-center gap-1 p-4">
              <Image alt="Logo" src={'/logo.svg'} width={32} height={32} />
              <p className="text-xl font-semibold tracking-tight">Charlitube</p>
            </div>
          </Link>
        </div>
        {/* searchBar */}
        <div className="mx-auto flex max-w-[720px] flex-1 justify-center">
          <SearchInput />
        </div>
        <div className="flex shrink-0 items-center gap-4">
          <AuthButton />
        </div>
      </div>
    </nav>
  );
}
