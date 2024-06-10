import { EntryColumn } from "@renderer/components/entry-column"
import { EntryContent } from "@renderer/components/entry-content"
import { views } from "@renderer/lib/constants"
import { cn } from "@renderer/lib/utils"
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
      activeEntry: state.activeEntry,
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
    <div ref={containerRef} className="flex grow">
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
          <div className="flex-1">
            <EntryContent entryId={activeEntry} />
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
