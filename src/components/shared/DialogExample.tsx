
import React from 'react';
import { useDialog } from '@/components/ui/dialog-service';
import { Button } from '@/components/ui/button';
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

interface ExampleDialogContentProps {
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
}

export function ExampleDialogContent({ onConfirm, onCancel, title }: ExampleDialogContentProps) {
  return (
    <>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>
          This is an example dialog using the unified dialog service.
        </DialogDescription>
      </DialogHeader>
      <div className="py-4">
        <p>The content of your dialog goes here.</p>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onConfirm}>
          Confirm
        </Button>
      </DialogFooter>
    </>
  );
}

export function DialogExample() {
  const { openDialog, closeDialog } = useDialog();
  
  const handleOpenDialog = () => {
    openDialog(
      <ExampleDialogContent
        title="Example Dialog"
        onConfirm={() => {
          console.log('Dialog confirmed');
          closeDialog();
        }}
        onCancel={() => {
          console.log('Dialog cancelled');
          closeDialog();
        }}
      />,
      {
        width: 'md',
        preventOutsideClose: true,
        onClose: () => {
          console.log('Dialog closed');
        }
      }
    );
  };
  
  return (
    <Button onClick={handleOpenDialog}>
      Open Dialog
    </Button>
  );
}
