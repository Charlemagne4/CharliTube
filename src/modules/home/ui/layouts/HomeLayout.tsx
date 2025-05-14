import { SidebarProvider } from '@/components/ui/sidebar';
import { ReactNode } from 'react';
import HomeNavbar from '../components/home-navbar';
import HomeSidebar from '../components/home-sidebar';

interface HomeLayoutProps {
  children: ReactNode;
}

export function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <div>
      {/* START layout Marker */}
      {/* <div className="h-1 bg-blue-600"></div> */}
      {/* END layout Marker */}

      <SidebarProvider>
        <div className="w-full">
          <HomeNavbar />
          <div className="flex min-h-screen pt-16">
            <HomeSidebar />
            <main className="flex-1 overflow-y-auto">{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}
