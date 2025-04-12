
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
    
    if (prevPathRef.current !== currentPath && openMobile) {
      // Close the sidebar with a slight delay to allow for transition
      const timer = setTimeout(() => {
        setOpenMobile(false);
      }, 150);
      
      return () => clearTimeout(timer);
    }
    
    // Update previous path reference
    prevPathRef.current = currentPath;
  }, [location.pathname, setOpenMobile, openMobile]);
  
  return (
    <Sheet 
      open={openMobile} 
      onOpenChange={(open) => {
        // Only update if we're actually changing the state
        if (open !== openMobile) {
          setOpenMobile(open);
        }
      }}
    >
      <SheetContent 
        side="left" 
        className="p-0 max-w-[85%] border-r"
        onClick={(e) => {
          // Prevent event bubbling that might cause state conflicts
          e.stopPropagation();
        }}
      >
        <ScrollArea className="h-full">
          <AppSidebar />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
