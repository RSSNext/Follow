import * as SwitchPrimitives from "@radix-ui/react-switch"
import { cn } from "@renderer/lib/utils"
import * as React from "react"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-5 w-9 shrink-0 items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
      "duration-200 data-[state=checked]:bg-theme-accent data-[state=unchecked]:bg-theme-inactive dark:data-[state=unchecked]:bg-theme-accent-100/10",
      className,
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block size-4 rounded-full ring-0 !transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0",
        "bg-theme-background dark:bg-neutral-300",
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
