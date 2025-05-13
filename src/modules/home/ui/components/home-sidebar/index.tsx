import { Sidebar, SidebarContent } from '@/components/ui/sidebar';
import MainSection from './MainSection';
import { Separator } from '@/components/ui/separator';
import PersonalSection from './PersonalSection';

function HomeSidebar() {
  return (
    <div>
      <Sidebar className="z-40 border-none pt-16" collapsible="icon">
        <SidebarContent className="bg-background">
          <MainSection />
          <Separator />
          <PersonalSection />
        </SidebarContent>
      </Sidebar>
    </div>
  );
}
export default HomeSidebar;
