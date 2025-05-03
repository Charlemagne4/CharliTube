import { HomeLayout } from '@/modules/home/ui/layouts/HomeLayout';
import { ReactNode } from 'react';

interface layoutProps {
  children: ReactNode;
}

function Layout({ children }: layoutProps) {
  return (
    <div>
      {/* layout Marker */}
      <div className="h-1 bg-blue-600"></div>
      {/* layout Marker */}
      <HomeLayout>{children}</HomeLayout>
    </div>
  );
}
export default Layout;
