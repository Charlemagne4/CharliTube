import { StudioLayout } from '@/modules/studio/ui/layouts/StudioLayout';
import { ReactNode } from 'react';

interface layoutProps {
  children: ReactNode;
}

function Layout({ children }: layoutProps) {
  return (
    <div>
      <StudioLayout>{children}</StudioLayout>
    </div>
  );
}
export default Layout;
