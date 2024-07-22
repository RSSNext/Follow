import * as React from "react"

export const PanelSplitter = (
  props: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >,
) => (
  <div className="relative h-full w-0 shrink-0">
    <div
      {...props}
      className="absolute inset-0 z-[9] w-[2px] -translate-x-1/2 cursor-ew-resize bg-transparent hover:bg-gray-400 hover:dark:bg-neutral-500"
    />
  </div>
)
