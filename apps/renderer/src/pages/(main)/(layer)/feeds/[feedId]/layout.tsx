import { useMemo, useRef } from "react"
import { useResizable } from "react-resizable-layout"
import { Outlet } from "react-router-dom"

import { getUISettings, setUISetting } from "~/atoms/settings/ui"
import { PanelSplitter } from "~/components/ui/divider"
import { views } from "~/constants"
import { useRouteParams } from "~/hooks/biz/useRouteParams"
import { cn, isSafari } from "~/lib/utils"
import { EntryColumn } from "~/modules/entry-column"

export function Component() {
  const containerRef = useRef<HTMLDivElement>(null)

  // Memo this initial value to avoid re-render

  const entryColWidth = useMemo(() => getUISettings().entryColWidth, [])
  const { view } = useRouteParams()
  const inWideMode = view ? views[view].wideMode : false
  const { position, separatorProps, isDragging, separatorCursor } = useResizable({
    axis: "x",
    // FIXME: Less than this width causes grid images to overflow on safari
    min: isSafari() ? 356 : 300,
    max: 450,
    initial: entryColWidth,
    containerRef,
    onResizeEnd({ position }) {
      setUISetting("entryColWidth", position)
    },
  })

  return (
    <div ref={containerRef} className="flex min-w-0 grow">
      <div
        className={cn("h-full shrink-0", inWideMode ? "flex-1" : "border-r", "will-change-[width]")}
        style={{
          width: position,
        }}
      >
        <EntryColumn />
      </div>
      {!inWideMode && (
        <PanelSplitter {...separatorProps} cursor={separatorCursor} isDragging={isDragging} />
      )}
      <Outlet />
    </div>
  )
}
