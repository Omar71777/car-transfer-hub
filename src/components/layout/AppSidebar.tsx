
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Sidebar } from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/auth';
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
    <Sidebar className="border-r border-border/40 bg-soft-beige/50 dark:bg-charcoal/90 backdrop-blur-sm">
      <div className="py-6 px-3">
        <SidebarUserProfile profile={profile} />
        <Separator className="bg-border/40 my-4" />
      </div>

      <SidebarMainMenu />
      <SidebarUserMenu onSignOut={signOut} />
      
      {isAdmin && <SidebarAdminMenu />}
      
      <SidebarFooter className="mt-auto border-t border-border/30 py-4">
        <div className="flex items-center justify-between px-4 py-2">
          <span className="text-xs text-muted-foreground">Tema</span>
          <ThemeToggle className="hover:bg-accent/10 hover:text-accent-foreground rounded-lg" />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
