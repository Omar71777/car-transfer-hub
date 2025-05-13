
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"
import * as React from "react"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import { SheetOverlay } from "./sheet-overlay"
import { SheetPortal } from "./sheet-portal"
import { SheetClose } from "./sheet"

const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500 overflow-auto backdrop-blur-sm",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom:
          "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right:
          "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
)

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
  VariantProps<typeof sheetVariants> { }

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ side = "right", className, children, ...props }, ref) => {
  const isMobile = useIsMobile()
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
  
  // Handle sheet opening and closing
  React.useEffect(() => {
    // Safety check to ensure pointer events are enabled
    document.body.style.pointerEvents = 'auto';
    
    // Lock scroll when sheet is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    
    // Cleanup function to ensure proper state restoration
    return () => {
      document.body.style.pointerEvents = 'auto';
      
      // Only restore scroll if this is the last dialog/sheet
      const hasOtherOverlays = document.querySelectorAll('[role="dialog"], [role="alertdialog"]').length > 1;
      if (!hasOtherOverlays) {
        document.body.style.overflow = originalOverflow;
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
    <SheetPortal>
      <SheetOverlay onClick={(e) => {
        // Prevent click propagation
        e.stopPropagation();
      }}/>
      <SheetPrimitive.Content
        ref={combinedRef}
        className={cn(
          sheetVariants({ side }), 
          isMobile && (side === "right" || side === "left") ? "w-[85%]" : "",
          isMobile ? "p-4" : "",
          className
        )}
        onClick={(e) => {
          e.stopPropagation();
          // Ensure pointer events are enabled when clicking content
          document.body.style.pointerEvents = 'auto';
          
          if (props.onClick) {
            props.onClick(e);
          }
        }}
        onOpenAutoFocus={(e) => {
          // Handle custom focus logic
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
        onEscapeKeyDown={(e) => {
          document.body.style.pointerEvents = 'auto';
          
          if (props.onEscapeKeyDown) {
            props.onEscapeKeyDown(e);
          }
        }}
        {...props}
      >
        {children}
        <SheetClose className="absolute right-4 top-4 rounded-full opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary p-2">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </SheetClose>
      </SheetPrimitive.Content>
    </SheetPortal>
  )
})
SheetContent.displayName = SheetPrimitive.Content.displayName

export { SheetContent, sheetVariants }
