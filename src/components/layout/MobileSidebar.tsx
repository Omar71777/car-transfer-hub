
import React from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useSidebar } from '@/components/ui/sidebar/sidebar-provider';
import { AppSidebar } from './AppSidebar';

export function MobileSidebar() {
  const { openMobile, setOpenMobile } = useSidebar();
  
  return (
    <Sheet open={openMobile} onOpenChange={setOpenMobile}>
      <SheetContent side="left" className="p-0 max-w-[85%] border-r">
        <div className="h-full overflow-y-auto">
          <AppSidebar />
        </div>
      </SheetContent>
    </Sheet>
  );
}
