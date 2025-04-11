
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 shadow-button hover:shadow-hover transition-all",
  {
    variants: {
      variant: {
        default: "bg-electric text-foam hover:bg-electric-light",
        destructive:
          "bg-vibrant text-foam-light hover:bg-vibrant-dark",
        outline:
          "border border-input bg-background hover:bg-aqua/10 hover:text-electric",
        secondary:
          "bg-aqua text-electric hover:bg-aqua-light",
        ghost: "hover:bg-aqua/10 hover:text-electric",
        link: "text-electric underline-offset-4 hover:underline shadow-none",
        warm: "bg-sand text-electric hover:bg-sand-light",
        soft: "bg-foam text-electric hover:bg-foam-dark dark:bg-pine dark:text-foam dark:hover:bg-pine-light",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-9 rounded-lg px-3.5 py-2",
        lg: "h-12 rounded-xl px-6 py-3 text-base",
        icon: "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
