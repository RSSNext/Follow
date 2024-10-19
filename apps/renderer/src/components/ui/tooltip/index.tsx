import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { m } from "framer-motion"
import * as React from "react"

import { cn } from "~/lib/utils"

import { tooltipStyle } from "./styles"

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
    className={cn(tooltipStyle.content, className)}
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
      <TooltipPrimitive.Arrow className="z-50 fill-white [clip-path:inset(0_-10px_-10px_-10px)] dark:fill-neutral-950 dark:drop-shadow-[0_0_1px_theme(colors.white/0.5)]" />
      {props.children}
    </m.div>
  </TooltipPrimitive.Content>
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipContent, TooltipTrigger }

export { RootPortal as TooltipPortal } from "../portal"
