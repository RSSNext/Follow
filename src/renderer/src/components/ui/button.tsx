import { Slot } from "@radix-ui/react-slot"
import { cn } from "@renderer/lib/utils"
import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"
import * as React from "react"

import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip"

export const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-4",
        lg: "h-11 rounded-md px-8",
        xl: "h-14 rounded-lg px-10",
        icon: "size-10",
      },
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-zinc-500/10 px-1.5",
        link: "text-primary underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, isLoading = false, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button"
    if (isLoading) {
      props.disabled = true
    }
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {isLoading && (
          <i className="i-mingcute-loading-3-line mr-2 animate-spin" />
        )}
        {props.children}
      </Comp>
    )
  },
)
Button.displayName = "Button"

// BIZ buttons

interface HeaderActionButtonProps {
  onClick: () => void
  icon?: React.ReactNode | React.FC<ComponentType>
  tooltip: string
  tooltipSide?: "top" | "bottom"
  active?: boolean
}
export const HeaderActionButton = React.forwardRef<
  HTMLButtonElement,
  ComponentType<HeaderActionButtonProps>
>(
  (
    { icon, onClick, tooltip, className, tooltipSide, children, active },
    ref,
  ) => (
    <Tooltip key={tooltip}>
      <TooltipTrigger asChild ref={ref}>
        <Button
          className={cn(
            "no-drag-region flex items-center text-xl",
            active && "bg-zinc-500/15 hover:bg-zinc-500/20",
            className,
          )}
          variant="ghost"
          size="sm"
          onClick={onClick}
        >
          {typeof icon === "function" ?
            React.createElement(icon, {
              className: "size-4 grayscale text-current",
            }) :
            icon}

          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent side={tooltipSide ?? "bottom"}>
        {tooltip}
      </TooltipContent>
    </Tooltip>
  ),
)
