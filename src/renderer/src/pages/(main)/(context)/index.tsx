import { views } from "@renderer/lib/constants"
import { cn } from "@renderer/lib/utils"
import { EntryColumn } from "@renderer/modules/entry-column"
import { EntryContent } from "@renderer/modules/entry-content"
import {
  feedActions,
  uiActions,
  useFeedStore,
  useUIStore,
} from "@renderer/store"
import { AnimatePresence } from "framer-motion"
import { useEffect, useMemo, useRef } from "react"
import { useResizable } from "react-resizable-layout"
import { useShallow } from "zustand/react/shallow"

export function Component() {
  const { activeEntry, activeList } = useFeedStore(
    useShallow((state) => ({
      activeList: state.activeList,
      activeEntry: state.activeEntryId,
    })),
  )
  const { setActiveEntry } = feedActions
  useEffect(() => {
    setActiveEntry(null)
  }, [activeList?.id])
  const containerRef = useRef<HTMLDivElement>(null)

  // Memo this initial value to avoid re-render
  // eslint-disable-next-line react-compiler/react-compiler
  const entryColWidth = useMemo(() => useUIStore.getState().entryColWidth, [])

  const { position, separatorProps } = useResizable({
    axis: "x",
    min: 300,
    max: 450,
    initial: entryColWidth,
    containerRef,
    onResizeEnd({ position }) {
      uiActions.setEntryColWidth(position)
    },
  })

  const inWideMode = activeList && views[activeList.view].wideMode
  return (
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
      <AnimatePresence>
        {!inWideMode && (
          <div className="min-w-0 flex-1">
            <EntryContent entry={activeEntry} />
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
