
import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogClose = DialogPrimitive.Close

const DialogPortal = DialogPrimitive.Portal

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-40 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  const isMobile = useIsMobile();
  const contentRef = React.useRef<HTMLDivElement>(null);
  const combinedRef = React.useMemo(
    () => (node: HTMLDivElement) => {
      // Apply both the forwarded ref and our local ref
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
      contentRef.current = node;
    },
    [ref]
  );
  
  // Handle dialog opening and closing
  React.useEffect(() => {
    // Safety check to ensure pointer events are enabled
    document.body.style.pointerEvents = 'auto';
    
    // Lock scroll when dialog is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.body.classList.add('dialog-open');
    
    // Cleanup function to ensure proper state restoration
    return () => {
      document.body.style.pointerEvents = 'auto';
      
      // Only restore scroll if this is the last dialog
      const hasOtherDialogs = document.querySelectorAll('[role="dialog"], [role="alertdialog"]').length > 1;
      if (!hasOtherDialogs) {
        document.body.style.overflow = originalOverflow;
        document.body.classList.remove('dialog-open');
      }
    };
  }, []);
  
  // Handle animation completion to ensure pointer events
  React.useEffect(() => {
    const contentElement = contentRef.current;
    if (!contentElement) return;
    
    const handleAnimationEnd = () => {
      // Ensure pointer events are enabled after animation
      document.body.style.pointerEvents = 'auto';
    };
    
    contentElement.addEventListener('animationend', handleAnimationEnd);
    
    return () => {
      contentElement.removeEventListener('animationend', handleAnimationEnd);
    };
  }, []);
  
  return (
    <DialogPortal>
      <DialogOverlay onClick={(e) => {
        // Prevent click propagation to avoid unexpected behavior
        e.stopPropagation();
      }}/>
      <DialogPrimitive.Content
        ref={combinedRef}
        className={cn(
          "fixed left-[50%] top-[50%] z-50 grid w-full max-h-[90vh] translate-x-[-50%] translate-y-[-50%] gap-4 border bg-card shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-xl overflow-y-auto",
          isMobile 
            ? "max-w-[92vw] p-5" 
            : "max-w-lg p-6",
          className
        )}
        aria-describedby={props['aria-describedby'] || 'dialog-description'}
        onOpenAutoFocus={(e) => {
          // Handle custom focus logic to prevent jumps
          e.preventDefault();
          document.body.style.pointerEvents = 'auto';
          
          // Let our useDialogManagement handle focus
          if (props.onOpenAutoFocus) {
            props.onOpenAutoFocus(e);
          }
        }}
        onCloseAutoFocus={(e) => {
          e.preventDefault();
          document.body.style.pointerEvents = 'auto';
          
          // Defer actual focus changes to avoid race conditions
          if (props.onCloseAutoFocus) {
            props.onCloseAutoFocus(e);
          }
        }}
        onEscapeKeyDown={(e) => {
          document.body.style.pointerEvents = 'auto';
          if (props.onEscapeKeyDown) {
            props.onEscapeKeyDown(e);
          }
        }}
        onPointerDownOutside={(e) => {
          document.body.style.pointerEvents = 'auto';
          if (props.onPointerDownOutside) {
            props.onPointerDownOutside(e);
          }
        }}
        onClick={(e) => {
          // Prevent click propagation and ensure pointer events
          document.body.style.pointerEvents = 'auto';
          e.stopPropagation();
          
          if (props.onClick) {
            props.onClick(e);
          }
        }}
        {...props}
      >
        {children}
        <div id="dialog-description" className="sr-only">
          Dialog content
        </div>
        <DialogPrimitive.Close className="absolute right-4 top-4 rounded-full opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent/10 data-[state=open]:text-muted-foreground p-2">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  )
})
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
