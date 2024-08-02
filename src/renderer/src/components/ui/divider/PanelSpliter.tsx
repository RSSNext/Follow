import * as React from "react"

export const PanelSplitter = (
  props: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >,
) => (
  <div className="relative h-full w-0 shrink-0">
    <button
      tabIndex={-1}
      type="button"
      {...props}
      className="absolute inset-0 z-[11] w-[2px] -translate-x-1/2 cursor-ew-resize bg-transparent hover:bg-gray-400 active:bg-theme-accent hover:dark:bg-neutral-500"
    />
  </div>
)
