
import React, { useEffect } from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useSidebar } from '@/components/ui/sidebar/sidebar-provider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AppSidebar } from './AppSidebar';
import { useLocation } from 'react-router-dom';

export function MobileSidebar() {
  const { openMobile, setOpenMobile } = useSidebar();
  const location = useLocation();
  
  // Close sidebar when route changes
  useEffect(() => {
    if (openMobile) {
      setOpenMobile(false);
    }
  }, [location.pathname, setOpenMobile, openMobile]);
  
  return (
    <Sheet open={openMobile} onOpenChange={setOpenMobile}>
      <SheetContent side="left" className="p-0 max-w-[85%] border-r">
        <ScrollArea className="h-full">
          <AppSidebar />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
