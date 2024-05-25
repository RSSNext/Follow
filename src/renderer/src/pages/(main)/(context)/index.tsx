import { EntryColumn } from "@renderer/components/entry-column"
import { EntryContent } from "@renderer/components/entry-content"
import { cn } from "@renderer/lib/utils"
import {
  feedActions,
  useFeedStore,
} from "@renderer/store"
import { AnimatePresence } from "framer-motion"
import { useEffect } from "react"
import { useShallow } from "zustand/react/shallow"

const wideMode = new Set([1, 2, 3, 4])

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
  }, [activeList])

  return (
    <>
      <div
        className={cn(
          "h-full shrink-0 overflow-y-auto border-r pt-10",
          activeList && wideMode.has(activeList.view) ? "flex-1" : "w-[340px]",
        )}
      >
        <EntryColumn />
      </div>
      <AnimatePresence>
        {!(activeList && wideMode.has(activeList.view)) && activeEntry && (
          <div className="flex-1">
            <EntryContent entryId={activeEntry} />
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
