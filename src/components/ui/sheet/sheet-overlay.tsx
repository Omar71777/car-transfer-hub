
import * as SheetPrimitive from "@radix-ui/react-dialog"
import * as React from "react"
import { cn } from "@/lib/utils"

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    onClick={(e) => {
      e.stopPropagation();
    }}
    {...props}
  />
))
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName

export { SheetOverlay }
