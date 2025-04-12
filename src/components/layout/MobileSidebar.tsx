
import React, { useEffect } from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useSidebar } from '@/components/ui/sidebar/sidebar-provider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AppSidebar } from './AppSidebar';
import { useLocation } from 'react-router-dom';

export function MobileSidebar() {
  const { openMobile, setOpenMobile } = useSidebar();
  const location = useLocation();
  
  // Track previous pathname to only close sidebar on actual navigation
  const prevPathRef = React.useRef(location.pathname);
  
  // Close sidebar only when route actually changes (not on initial render or sidebar state changes)
  useEffect(() => {
    const currentPath = location.pathname;
    
    // Only close if the path changed and sidebar is open
    if (prevPathRef.current !== currentPath && openMobile) {
      // Add a small delay to prevent closing immediately
      const timer = setTimeout(() => {
        setOpenMobile(false);
      }, 100);
      
      return () => clearTimeout(timer);
    }
    
    // Update previous path reference
    prevPathRef.current = currentPath;
  }, [location.pathname, setOpenMobile]);
  
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
