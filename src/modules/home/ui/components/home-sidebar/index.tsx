import { Sidebar, SidebarContent } from '@/components/ui/sidebar';
import MainSection from './MainSection';
import { Separator } from '@/components/ui/separator';
import PersonalSection from './PersonalSection';
import SubscribtionsSection from './SubscribtionsSection';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';

async function HomeSidebar() {
  const session = await getServerSession(authOptions);
  return (
    <div>
      <Sidebar className="z-40 border-none pt-16" collapsible="icon">
        <SidebarContent className="bg-background">
          <MainSection />
          <Separator />
          <PersonalSection />
          {session?.user && <SubscribtionsSection />}
        </SidebarContent>
      </Sidebar>
    </div>
  );
}
export default HomeSidebar;
