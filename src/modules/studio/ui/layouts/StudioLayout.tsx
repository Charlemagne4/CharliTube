import { SidebarProvider } from '@/components/ui/sidebar';
import { ReactNode } from 'react';
import StudioNavbar from '../components/studio-navbar';
import StudioSidebar from '../components/studio-navbar/studio-sidebar';

interface HomeLayoutProps {
  children: ReactNode;
}

export function StudioLayout({ children }: HomeLayoutProps) {
  return (
    <div>
      {/* START layout Marker */}
      <div className="h-1 bg-blue-600"></div>
      {/* END layout Marker */}

      <SidebarProvider>
        <div className="w-full">
          <StudioNavbar />
          <div className="flex min-h-screen pt-16">
            <StudioSidebar />
            <main className="flex-1 overflow-y-auto">{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}
