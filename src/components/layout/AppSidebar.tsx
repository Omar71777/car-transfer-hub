
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Sidebar } from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/auth';
import { useSidebar } from '@/components/ui/sidebar/sidebar-provider';
import { SidebarUserProfile } from './sidebar/SidebarUserProfile';
import { SidebarMainMenu } from './sidebar/SidebarMainMenu';
import { SidebarUserMenu } from './sidebar/SidebarUserMenu';
import { SidebarAdminMenu } from './sidebar/SidebarAdminMenu';
import { SidebarFooter } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

export const AppSidebar = () => {
  const { profile, isAdmin, signOut } = useAuth();
  const { openMobile, setOpenMobile } = useSidebar();

  return (
    <Sidebar className="border-r border-white/20 bg-primary backdrop-blur-md">
      <div className="py-6 px-3">
        <SidebarUserProfile profile={profile} />
        <Separator className="bg-white/20 my-4" />
      </div>

      <SidebarMainMenu />
      <SidebarUserMenu onSignOut={signOut} />
      
      {isAdmin && <SidebarAdminMenu />}
      
      <SidebarFooter className="mt-auto border-t border-white/20 py-4">
        <div className="px-4 py-2 text-xs text-white/70">
          Ibiza Transfer Hub © {new Date().getFullYear()}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
