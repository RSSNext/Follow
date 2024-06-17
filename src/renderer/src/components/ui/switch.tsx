import * as SwitchPrimitives from "@radix-ui/react-switch"
import { cn } from "@renderer/lib/utils"
import * as React from "react"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-6 w-11 shrink-0 items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
      "duration-200 data-[state=checked]:bg-theme-accent data-[state=unchecked]:bg-theme-inactive dark:data-[state=unchecked]:bg-theme-accent-100/10",
      className,
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block size-5 rounded-full shadow-lg ring-0 !transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
        "bg-background dark:bg-neutral-300",
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
