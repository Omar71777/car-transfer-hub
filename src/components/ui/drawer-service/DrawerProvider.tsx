
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerDescription, 
  DrawerFooter 
} from '@/components/ui/drawer';

interface DrawerContextType {
  openDrawer: (content: ReactNode, options?: DrawerOptions) => void;
  closeDrawer: () => void;
}

interface DrawerOptions {
  title?: string;
  description?: string;
  className?: string;
  onClose?: () => void;
  showCloseButton?: boolean;
  footer?: ReactNode;
  shouldScaleBackground?: boolean;
}

const DrawerContext = createContext<DrawerContextType | undefined>(undefined);

export function DrawerProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [drawerContent, setDrawerContent] = useState<ReactNode | null>(null);
  const [drawerOptions, setDrawerOptions] = useState<DrawerOptions>({});

  const openDrawer = (content: ReactNode, options: DrawerOptions = {}) => {
    setDrawerContent(content);
    setDrawerOptions(options);
    setIsOpen(true);
    document.body.classList.add('drawer-open');
  };

  const closeDrawer = () => {
    setIsOpen(false);
    document.body.classList.remove('drawer-open');
    
    // Execute onClose callback if provided
    if (drawerOptions.onClose) {
      drawerOptions.onClose();
    }
  };

  return (
    <DrawerContext.Provider value={{ openDrawer, closeDrawer }}>
      {children}
      <Drawer 
        open={isOpen} 
        onOpenChange={setIsOpen}
        shouldScaleBackground={drawerOptions.shouldScaleBackground}
        onClose={closeDrawer}
      >
        <DrawerContent className={drawerOptions.className}>
          {(drawerOptions.title || drawerOptions.description) && (
            <DrawerHeader>
              {drawerOptions.title && <DrawerTitle>{drawerOptions.title}</DrawerTitle>}
              {drawerOptions.description && <DrawerDescription>{drawerOptions.description}</DrawerDescription>}
            </DrawerHeader>
          )}
          {drawerContent}
          {drawerOptions.footer && (
            <DrawerFooter>
              {drawerOptions.footer}
            </DrawerFooter>
          )}
        </DrawerContent>
      </Drawer>
    </DrawerContext.Provider>
  );
}

export function useDrawer() {
  const context = useContext(DrawerContext);
  
  if (context === undefined) {
    throw new Error('useDrawer must be used within a DrawerProvider');
  }
  
  return context;
}
