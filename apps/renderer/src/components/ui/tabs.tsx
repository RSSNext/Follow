import * as TabsPrimitive from "@radix-ui/react-tabs"
import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"
import { m } from "framer-motion"
import * as React from "react"

import { cn } from "~/lib/utils"

const TabsIdContext = React.createContext<string | null>(null)

const Tabs: typeof TabsPrimitive.Root = React.forwardRef((props, ref) => {
  const { children, ...rest } = props
  const id = React.useId()

  return (
    <TabsIdContext.Provider value={id}>
      <TabsPrimitive.Root {...rest} ref={ref}>
        {children}
      </TabsPrimitive.Root>
    </TabsIdContext.Provider>
  )
})

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
const TabsList = React.forwardRef<React.ElementRef<typeof TabsPrimitive.List>, TabsListProps>(
  ({ className, variant, ...props }, ref) => (
    <TabsPrimitive.List
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center text-muted-foreground",
        tabsListVariants({ variant }),
        className,
      )}
      {...props}
    />
  ),
)
TabsList.displayName = TabsPrimitive.List.displayName

const tabsTriggerVariants = cva("", {
  variants: {
    variant: {
      default:
        "py-1.5 border-b-2 border-transparent data-[state=active]:text-accent dark:data-[state=active]:text-theme-accent-500",
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
  const id = React.useContext(TabsIdContext)
  const layoutId = `tab-selected-underline-${id}`
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
          layoutId={layoutId}
          className="absolute -bottom-1 h-0.5 w-[calc(100%-16px)] rounded bg-accent"
        />
      )}
    </TabsPrimitive.Trigger>
  )
})
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn("mt-2 ring-offset-background focus-visible:outline-none", className)}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsContent, TabsList, TabsTrigger }
