'use client';

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar';
import { HistoryIcon, ListVideoIcon, ThumbsUpIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const items = [
  {
    title: 'History',
    url: '/playlists/history',
    icon: HistoryIcon,
    auth: true
  },
  {
    title: 'Like Videos',
    url: '/playlists/liked',
    icon: ThumbsUpIcon,
    auth: true
  },
  {
    title: 'All Playlists',
    url: '/playlists',
    icon: ListVideoIcon,
    auth: true
  }
];

function PersonalSection() {
  const router = useRouter();
  return (
    <SidebarGroup>
      <SidebarGroupLabel>You</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                asChild
                isActive={false} // TODO: look at current pathname
                onClick={(e) => {
                  if (status !== 'authenticated' && item.auth) {
                    e.preventDefault();
                    return router.push('/signin');
                  }
                }} //TODO: do something on click
              >
                <Link href={item.url} className="flex items-center gap-4">
                  <item.icon />
                  <span className="text-sm">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
export default PersonalSection;
