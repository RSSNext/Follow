import { useInputComposition } from "@renderer/hooks/common/use-input-composition"
import { stopPropagation } from "@renderer/lib/dom"
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
      onContextMenu={stopPropagation}
      ref={ref}
      className={cn(
        "min-w-0 flex-auto appearance-none rounded-lg text-sm",
        "bg-theme-background px-3 py-[calc(theme(spacing.2)-1px)] placeholder:text-zinc-400 dark:bg-zinc-700/[0.15]",
        "ring-theme-accent/20 duration-200 focus:border-theme-accent/80 focus:outline-none focus:ring-2",
        "border border-border",
        "dark:text-zinc-200 dark:placeholder:text-zinc-500",
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
