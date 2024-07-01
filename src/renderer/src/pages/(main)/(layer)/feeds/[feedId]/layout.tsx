import { getUISettings, setUISetting } from "@renderer/atoms"
import { useRouteView } from "@renderer/hooks/biz/useRouteParams"
import { views } from "@renderer/lib/constants"
import { cn } from "@renderer/lib/utils"
import { EntryColumn } from "@renderer/modules/entry-column"
import { useMemo, useRef } from "react"
import { HotkeysProvider } from "react-hotkeys-hook"
import { useResizable } from "react-resizable-layout"
import { Outlet } from "react-router-dom"

export function Component() {
  const containerRef = useRef<HTMLDivElement>(null)

  // Memo this initial value to avoid re-render

  const entryColWidth = useMemo(() => getUISettings().entryColWidth, [])
  const view = useRouteView()
  const inWideMode = view ? views[view].wideMode : false
  const { position, separatorProps } = useResizable({
    axis: "x",
    min: 300,
    max: 450,
    initial: entryColWidth,
    containerRef,
    onResizeEnd({ position }) {
      setUISetting("entryColWidth", position)
    },
  })

  return (
    <HotkeysProvider initiallyActiveScopes={["home"]}>
      <div ref={containerRef} className="flex min-w-0 grow">
        <div
          className={cn(
            "h-full shrink-0 overflow-y-auto",
            inWideMode ? "flex-1" : "border-r",
            "will-change-[width]",
          )}
          style={{
            width: position,
          }}
        >
          <EntryColumn />
        </div>
        {!inWideMode && (
          <div
            {...separatorProps}
            className="h-full w-px shrink-0 cursor-ew-resize hover:bg-border"
          />
        )}
        <Outlet />
      </div>
    </HotkeysProvider>
  )
}
