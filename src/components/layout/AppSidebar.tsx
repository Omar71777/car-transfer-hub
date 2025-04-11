import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Sidebar, SidebarFooter } from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/auth';
import { useSidebar } from '@/components/ui/sidebar/sidebar-provider';
import { SidebarUserProfile } from './sidebar/SidebarUserProfile';
import { SidebarMainMenu } from './sidebar/SidebarMainMenu';
import { SidebarUserMenu } from './sidebar/SidebarUserMenu';
import { SidebarAdminMenu } from './sidebar/SidebarAdminMenu';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export const AppSidebar = () => {
  const { profile, isAdmin, signOut } = useAuth();
  const { openMobile, setOpenMobile, toggleSidebar, state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar className="border-r border-electric/10 bg-electric text-white backdrop-blur-md">
      <div className="py-6 px-3 relative">
        <SidebarUserProfile profile={profile} />
        <Separator className="bg-white/10 my-4" />
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="absolute -right-3 top-20 h-6 w-6 rounded-full bg-white text-electric shadow-sm hover:bg-foam-light"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <SidebarMainMenu />
      <SidebarUserMenu onSignOut={signOut} />
      
      {isAdmin && <SidebarAdminMenu />}
      
      <SidebarFooter className="mt-auto border-t border-white/10 py-4">
        <div className={cn("px-4 py-2 text-xs text-white/60", isCollapsed && "text-center")}>
          {!isCollapsed ? "Ibiza Transfer Hub © 2025" : "ITH © 2025"}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
