import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@renderer/lib/utils"
import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"
import * as React from "react"

const Tabs = TabsPrimitive.Root

const tabsListVariants = cva(
  "",
  {
    variants: {
      variant: {
        default: "border-b",
        rounded: "rounded-md bg-muted p-1",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export interface TabsListProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>,
  VariantProps<typeof tabsListVariants> {
}
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

const tabsTriggerVariants = cva(
  "",
  {
    variants: {
      variant: {
        default: "py-1.5 border-b-2 border-transparent data-[state=active]:border-current data-[state=active]:text-theme-accent dark:data-[state=active]:text-theme-accent-500",
        rounded: "py-1 rounded-sm data-[state=active]:bg-theme-accent-300 dark:data-[state=active]:bg-theme-accent-800 data-[state=active]:shadow-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export interface TabsTriggerProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>,
  VariantProps<typeof tabsTriggerVariants> {
}
const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, variant, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap px-3 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-theme-foreground",
      tabsTriggerVariants({ variant }),
      className,
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className,
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsContent, TabsList, TabsTrigger }
