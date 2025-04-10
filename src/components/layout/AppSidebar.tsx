
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Sidebar } from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { useSidebar } from '@/components/ui/sidebar/sidebar-provider';
import { SidebarUserProfile } from './sidebar/SidebarUserProfile';
import { SidebarMainMenu } from './sidebar/SidebarMainMenu';
import { SidebarUserMenu } from './sidebar/SidebarUserMenu';
import { SidebarAdminMenu } from './sidebar/SidebarAdminMenu';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { SidebarFooter } from '@/components/ui/sidebar';

export const AppSidebar = () => {
  const { profile, isAdmin, signOut } = useAuth();
  const { openMobile, setOpenMobile } = useSidebar();

  return (
    <Sidebar>
      <div className="pb-4">
        <SidebarUserProfile profile={profile} />
        <Separator />
      </div>

      <SidebarMainMenu />
      <SidebarUserMenu onSignOut={signOut} />
      
      {isAdmin && <SidebarAdminMenu />}
      
      <SidebarFooter className="mt-auto">
        <div className="flex items-center justify-between px-4 py-2">
          <span className="text-xs text-sidebar-foreground/70">Tema</span>
          <ThemeToggle className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
