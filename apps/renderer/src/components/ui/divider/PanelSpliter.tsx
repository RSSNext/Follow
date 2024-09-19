import * as React from "react"

import { cn } from "~/lib/utils"

export const PanelSplitter = (
  props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
    isDragging?: boolean
    cursor?: string
  },
) => {
  const { isDragging, cursor, ...rest } = props

  React.useEffect(() => {
    if (!isDragging) return
    const $css = document.createElement("style")

    $css.innerHTML = `
      * {
        cursor: ${cursor} !important;
      }
    `

    document.head.append($css)
    return () => {
      $css.remove()
    }
  }, [cursor, isDragging])

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
