import { cn } from "@follow/utils/utils"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import * as React from "react"

export const Checkbox = React.forwardRef<
  HTMLInputElement,
  React.ComponentPropsWithoutRef<"input"> & {
    onCheckedChange?: (checked: boolean) => void
  }
>(({ className, onCheckedChange, ...props }, ref) => (
  <input
    type="checkbox"
    ref={ref}
    className={cn("checkbox", className)}
    {...props}
    onChange={(event) => {
      onCheckedChange?.(event.target.checked)
      props.onChange?.(event)
    }}
  />
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName
