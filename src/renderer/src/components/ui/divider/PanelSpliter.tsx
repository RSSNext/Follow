import { cn } from "@renderer/lib/utils"
import * as React from "react"

export const PanelSplitter = (
  props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
    isDragging?: boolean
  },
) => {
  const { isDragging, ...rest } = props

  return (
    <div className="relative h-full w-0 shrink-0">
      <div
        tabIndex={-1}
        {...rest}
        className={cn(
          "absolute inset-0 z-[11] w-[2px] -translate-x-1/2 cursor-ew-resize bg-transparent hover:bg-gray-400 active:!bg-accent hover:dark:bg-neutral-500",
          isDragging ? "bg-accent" : "",
        )}
      />
    </div>
  )
}
