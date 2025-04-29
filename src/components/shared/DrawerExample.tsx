
import React from 'react';
import { useDrawer } from '@/components/ui/drawer-service';
import { Button } from '@/components/ui/button';
import { DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from '@/components/ui/drawer';

interface ExampleDrawerContentProps {
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
}

export function ExampleDrawerContent({ onConfirm, onCancel, title }: ExampleDrawerContentProps) {
  return (
    <>
      <DrawerHeader>
        <DrawerTitle>{title}</DrawerTitle>
        <DrawerDescription>
          This is an example drawer using the unified drawer service.
        </DrawerDescription>
      </DrawerHeader>
      <div className="px-4 py-4">
        <p>The content of your drawer goes here.</p>
      </div>
      <DrawerFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onConfirm}>
          Confirm
        </Button>
      </DrawerFooter>
    </>
  );
}

export function DrawerExample() {
  const { openDrawer, closeDrawer } = useDrawer();
  
  const handleOpenDrawer = () => {
    openDrawer(
      <ExampleDrawerContent
        title="Example Drawer"
        onConfirm={() => {
          console.log('Drawer confirmed');
          closeDrawer();
        }}
        onCancel={() => {
          console.log('Drawer cancelled');
          closeDrawer();
        }}
      />,
      {
        title: "Example Drawer", 
        description: "This is an example drawer with a title and description set via options.",
        shouldScaleBackground: true,
        onClose: () => {
          console.log('Drawer closed');
        }
      }
    );
  };
  
  return (
    <Button onClick={handleOpenDrawer}>
      Open Drawer
    </Button>
  );
}
