import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { cn } from "@renderer/lib/utils"
import { m } from "framer-motion"
import * as React from "react"

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip: typeof TooltipProvider = ({ children, ...props }) => (
  <TooltipProvider {...props}>
    <TooltipPrimitive.Tooltip>{children}</TooltipPrimitive.Tooltip>
  </TooltipProvider>
)

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    asChild
    sideOffset={sideOffset}
    className={cn(
      "relative z-[101] border border-accent/10 bg-white px-2 py-1 text-foreground dark:bg-neutral-950",
      // "animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out  data-[state=closed]:zoom-out-95 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2",
      "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
      "rounded-lg text-sm",
      "max-w-[75ch] select-text",

      "drop-shadow data-[side=top]:shadow-tooltip-bottom data-[side=bottom]:shadow-tooltip-top",

      className,
    )}
    {...props}
  >
    <m.div
      initial={{ opacity: 0.82, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        type: "spring",
        tension: 280,
        friction: 60,

        duration: 0.1,
      }}
    >
      {/* https://github.com/radix-ui/primitives/discussions/868 */}
      <TooltipPrimitive.Arrow className="z-50 fill-white drop-shadow-[0_0_1px_theme(colors.accent.DEFAULT/0.3)] [clip-path:inset(0_-10px_-10px_-10px)] dark:fill-neutral-950" />
      {props.children}
    </m.div>
  </TooltipPrimitive.Content>
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

const TooltipPortal = TooltipPrimitive.Portal

export { Tooltip, TooltipContent, TooltipPortal, TooltipTrigger }
