import { HomeLayout } from '@/modules/home/ui/layouts/HomeLayout';
import { ReactNode } from 'react';

interface layoutProps {
  children: ReactNode;
}

function Layout({ children }: layoutProps) {
  return (
    <div>
      <HomeLayout>{children}</HomeLayout>
    </div>
  );
}
export default Layout;
