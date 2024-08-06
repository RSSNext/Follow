import { getUISettings, setUISetting } from "@renderer/atoms/settings/ui"
import { PanelSplitter } from "@renderer/components/ui/divider"
import { views } from "@renderer/constants"
import {
  useRouteParms,
} from "@renderer/hooks/biz/useRouteParams"
import { cn, isSafari } from "@renderer/lib/utils"
import { EntryColumn } from "@renderer/modules/entry-column"
import { useMemo, useRef } from "react"
import { useResizable } from "react-resizable-layout"
import { Outlet } from "react-router-dom"

export function Component() {
  const containerRef = useRef<HTMLDivElement>(null)

  // Memo this initial value to avoid re-render

  const entryColWidth = useMemo(() => getUISettings().entryColWidth, [])
  const { feedId, view } = useRouteParms()
  const inWideMode = view ? views[view].wideMode : false
  const { position, separatorProps } = useResizable({
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
        className={cn(
          "h-full shrink-0",
          inWideMode ? "flex-1" : "border-r",
          "will-change-[width]",
        )}
        style={{
          width: position,
        }}
      >
        <EntryColumn key={`${feedId}-${view}`} />
      </div>
      {!inWideMode && <PanelSplitter {...separatorProps} />}
      <Outlet />
    </div>
  )
}
