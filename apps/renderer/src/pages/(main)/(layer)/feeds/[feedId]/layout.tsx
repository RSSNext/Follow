import { useMemo, useRef } from "react"
import { useResizable } from "react-resizable-layout"
import { Outlet } from "react-router-dom"

import { getUISettings, setUISetting, useUISettingKey } from "~/atoms/settings/ui"
import { PanelSplitter } from "~/components/ui/divider"
import { views } from "~/constants"
import { useRouteParams } from "~/hooks/biz/useRouteParams"
import { cn, isSafari } from "~/lib/utils"
import { EntryColumn } from "~/modules/entry-column"
import { AppLayoutGridContainerProvider } from "~/providers/app-grid-layout-container-provider"

export function Component() {
  const containerRef = useRef<HTMLDivElement>(null)

  // Memo this initial value to avoid re-render

  const settingWideMode = useUISettingKey("wideMode")
  const entryColWidth = useMemo(() => getUISettings().entryColWidth, [])
  const { view } = useRouteParams()
  const inWideMode = (view ? views[view].wideMode : false) || settingWideMode
  const feedColumnWidth = useUISettingKey("feedColWidth")
  const { position, separatorProps, isDragging, separatorCursor } = useResizable({
    axis: "x",
    // FIXME: Less than this width causes grid images to overflow on safari
    min: isSafari() ? 356 : 300,
    max: Math.max((window.innerWidth - feedColumnWidth) / 2, 600),
    initial: entryColWidth,
    containerRef,
    onResizeEnd({ position }) {
      setUISetting("entryColWidth", position)
    },
  })

  return (
    <div ref={containerRef} className="relative flex min-w-0 grow">
      <div
        className={cn("h-full shrink-0", inWideMode ? "flex-1" : "border-r", "will-change-[width]")}
        style={{
          width: position,
        }}
      >
        <AppLayoutGridContainerProvider>
          <EntryColumn />
        </AppLayoutGridContainerProvider>
      </div>
      {!inWideMode && (
        <PanelSplitter {...separatorProps} cursor={separatorCursor} isDragging={isDragging} />
      )}
      <Outlet />
    </div>
  )
}
