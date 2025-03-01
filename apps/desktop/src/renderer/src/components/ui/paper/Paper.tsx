import { cn } from "@follow/utils/utils"
import type { JSX } from "react"

export const Paper: Component<{
  as?: keyof JSX.IntrinsicElements | Component
}> = ({ children, className, as: As = "main" }) => (
  <As
    className={cn(
      "relative bg-white md:col-start-1 lg:col-auto dark:bg-zinc-900",
      "-m-4 p-[2rem_1rem] md:m-0 lg:p-[30px_45px]",
      "rounded-[0_6px_6px_0] border-zinc-200/70 lg:border dark:border-neutral-800",
      "shadow-perfect perfect-sm",
      "min-w-0",
      "print:!border-none print:!bg-transparent print:!shadow-none",
      className,
    )}
  >
    {children}
  </As>
)
