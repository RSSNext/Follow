import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@renderer/lib/utils"
import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"
import { m } from "framer-motion"
import * as React from "react"

import { AutoResizeHeight } from "./auto-resize-height"

const Tabs = TabsPrimitive.Root

const tabsListVariants = cva("", {
  variants: {
    variant: {
      default: "border-b",
      rounded: "rounded-md bg-muted p-1",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

export interface TabsListProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>,
  VariantProps<typeof tabsListVariants> {}
const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  TabsListProps
>(({ className, variant, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center text-muted-foreground",
      tabsListVariants({ variant }),
      className,
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const tabsTriggerVariants = cva("", {
  variants: {
    variant: {
      default:
        "py-1.5 border-b-2 border-transparent data-[state=active]:text-theme-accent dark:data-[state=active]:text-theme-accent-500",
      rounded:
        "py-1 rounded-sm data-[state=active]:bg-theme-accent-300 dark:data-[state=active]:bg-theme-accent-800 data-[state=active]:shadow-sm",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

export interface TabsTriggerProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>,
  VariantProps<typeof tabsTriggerVariants> {}
const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, variant, children, ...props }, ref) => {
  const triggerRef = React.useRef(null)
  React.useImperativeHandle(ref, () => triggerRef.current!, [ref])

  const [isSelect, setIsSelect] = React.useState(false)
  React.useLayoutEffect(() => {
    if (!triggerRef.current) return

    const trigger = triggerRef.current as HTMLElement

    const isSelect = trigger.dataset.state === "active"
    setIsSelect(isSelect)
    const ob = new MutationObserver(() => {
      const isSelect = trigger.dataset.state === "active"
      setIsSelect(isSelect)
    })
    ob.observe(trigger, {
      attributes: true,
      attributeFilter: ["data-state"],
    })

    return () => {
      ob.disconnect()
    }
  }, [])

  return (
    <TabsPrimitive.Trigger
      ref={triggerRef}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap px-3 text-sm font-medium ring-offset-background transition-all disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-theme-foreground",
        "relative",
        tabsTriggerVariants({ variant }),
        className,
      )}
      {...props}
    >
      {children}
      {isSelect && (
        <m.span
          layoutId="tab-selected-underline"
          className="absolute -bottom-1 h-0.5 w-[calc(100%-16px)] rounded bg-theme-accent"
        />
      )}
    </TabsPrimitive.Trigger>
  )
})
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content> & {
    transition?: boolean
  }
>(({ className, transition, ...props }, ref) => {
  const content = (
    <TabsPrimitive.Content
      ref={ref}
      className={cn(
        "ring-offset-background focus-visible:outline-none",
        className,
        transition ? "pt-2" : "mt-2",
      )}
      {...props}
    />
  )

  if (transition) {
    return <AutoResizeHeight duration={0.15}>{content}</AutoResizeHeight>
  }
  return content
})
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsContent, TabsList, TabsTrigger }
