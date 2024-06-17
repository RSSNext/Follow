import { useInputComposition } from "@renderer/hooks/common/use-input-composition"
import { cn } from "@renderer/lib/utils"
import type { DetailedHTMLProps, InputHTMLAttributes } from "react"
import { forwardRef } from "react"

// This composition handler is not perfect
// @see https://foxact.skk.moe/use-composition-input
export const Input = forwardRef<
  HTMLInputElement,
  Omit<
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    "ref"
  >
>(({ className, ...props }, ref) => {
  const inputProps = useInputComposition(props)
  return (
    <input
      ref={ref}
      className={cn(
        "min-w-0 flex-auto appearance-none rounded-lg border ring-theme-accent/20 duration-200 sm:text-sm lg:text-base",
        "bg-background px-3 py-[calc(theme(spacing.2)-1px)] placeholder:text-zinc-400 focus:outline-none focus:ring-2 dark:bg-zinc-700/[0.15]",
        "border-border",
        "focus:border-theme-accent/80 dark:text-zinc-200 dark:placeholder:text-zinc-500",
        props.type === "password" ?
          "font-mono placeholder:font-sans" :
          "font-sans",
        "w-full",
        className,
      )}
      {...props}
      {...inputProps}
    />
  )
})
Input.displayName = "Input"
