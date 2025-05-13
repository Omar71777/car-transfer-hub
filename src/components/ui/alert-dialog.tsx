
import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"

const AlertDialog = AlertDialogPrimitive.Root

const AlertDialogTrigger = AlertDialogPrimitive.Trigger

const AlertDialogPortal = AlertDialogPrimitive.Portal

const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => {
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
    document.body.style.overflow = 'hidden';
    document.body.classList.add('dialog-open');
    
    // Cleanup function to ensure proper state restoration
    return () => {
      document.body.style.pointerEvents = 'auto';
      document.body.classList.remove('dialog-open');
      
      // Only restore scroll if this is the last dialog
      const hasOtherDialogs = document.querySelectorAll('[role="dialog"], [role="alertdialog"]').length > 1;
      if (!hasOtherDialogs) {
        document.body.style.overflow = '';
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
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        ref={combinedRef}
        className={cn(
          "fixed left-[50%] top-[50%] z-50 grid w-full max-h-[90vh] translate-x-[-50%] translate-y-[-50%] gap-4 border bg-card shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-xl overflow-y-auto",
          isMobile 
            ? "max-w-[92vw] p-4" 
            : "max-w-lg p-6",
          className
        )}
        aria-describedby="alert-dialog-description"
        onOpenAutoFocus={(e) => {
          // Use default focus behavior for alert dialogs for accessibility
          document.body.style.pointerEvents = 'auto';
          if (props.onOpenAutoFocus) {
            props.onOpenAutoFocus(e);
          }
        }}
        onCloseAutoFocus={(e) => {
          document.body.style.pointerEvents = 'auto';
          if (props.onCloseAutoFocus) {
            props.onCloseAutoFocus(e);
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
        {props.children}
        <div id="alert-dialog-description" className="sr-only">
          Alert dialog content
        </div>
      </AlertDialogPrimitive.Content>
    </AlertDialogPortal>
  )
})
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName

const AlertDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
AlertDialogHeader.displayName = "AlertDialogHeader"

const AlertDialogFooter = ({
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
AlertDialogFooter.displayName = "AlertDialogFooter"

const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold", className)}
    {...props}
  />
))
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName

const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    id="alert-dialog-description"
    {...props}
  />
))
AlertDialogDescription.displayName =
  AlertDialogPrimitive.Description.displayName

const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action
    ref={ref}
    className={cn(buttonVariants(), className)}
    onClick={(e) => {
      // Ensure pointer events are enabled when clicking action
      document.body.style.pointerEvents = 'auto';
      if (props.onClick) {
        props.onClick(e);
      }
    }}
    {...props}
  />
))
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName

const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn(
      buttonVariants({ variant: "outline" }),
      "mt-2 sm:mt-0",
      className
    )}
    onClick={(e) => {
      // Ensure pointer events are enabled when cancelling
      document.body.style.pointerEvents = 'auto';
      if (props.onClick) {
        props.onClick(e);
      }
    }}
    {...props}
  />
))
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}
