import { EntryColumn } from "@renderer/components/entry-column"
import { EntryContent } from "@renderer/components/entry-content"
import { views } from "@renderer/lib/constants"
import { cn } from "@renderer/lib/utils"
import {
  feedActions,
  useFeedStore,
} from "@renderer/store"
import { AnimatePresence } from "framer-motion"
import { useEffect } from "react"
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

  return (
    <>
      <div
        className={cn(
          "h-full shrink-0 overflow-y-auto border-r",
          window.electron ? "pt-10" : "pt-4",
          activeList && views[activeList.view].wideMode ? "flex-1" : "w-[340px]",
        )}
      >
        <EntryColumn />
      </div>
      <AnimatePresence>
        {!(activeList && views[activeList.view].wideMode) && activeEntry && (
          <div className="flex-1">
            <EntryContent entryId={activeEntry} />
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
