
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
import { useIsMobile } from '@/hooks/use-mobile';

export const AppSidebar = () => {
  const { profile, isAdmin, signOut } = useAuth();
  const { openMobile } = useSidebar();
  const isMobile = useIsMobile();

  return (
    <Sidebar className="bg-white/85 backdrop-blur-lg border-r border-sidebar-border/20" data-mobile={isMobile}>
      <div className="py-6 px-3">
        <SidebarUserProfile profile={profile} />
        <Separator className="bg-sidebar-border/30 my-4" />
      </div>

      {/* Main menu section with blue gradient */}
      <div className="sidebar-section primary px-2 py-3 mx-2 mb-4">
        <SidebarMainMenu />
      </div>
      
      {/* User menu section with green gradient */}
      <div className="sidebar-section account px-2 py-3 mx-2 mb-4">
        <SidebarUserMenu onSignOut={signOut} />
      </div>
      
      {/* Admin menu with pink/purple gradient (only shown to admins) */}
      {isAdmin && (
        <div className="sidebar-section admin px-2 py-3 mx-2 mb-4">
          <SidebarAdminMenu />
        </div>
      )}
      
      <SidebarFooter className="mt-auto border-t border-sidebar-border/30 py-4">
        <div className="px-4 py-2 text-xs text-sidebar-foreground/70">
          CTHub © {new Date().getFullYear()}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
