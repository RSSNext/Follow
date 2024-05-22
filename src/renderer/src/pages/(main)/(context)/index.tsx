import { EntryColumn } from "@renderer/components/entry-column"
import { useEffect } from "react"
import { ActivedList, ActivedEntry } from "@renderer/lib/types"
import { cn } from "@renderer/lib/utils"
import { EntryContent } from "@renderer/components/entry-content"
import { AnimatePresence } from "framer-motion"
import { useOutletContext } from "react-router-dom"

const wideMode = [1, 2, 3, 4]

export function Component() {
  const { activedList, activedEntry, setActivedEntry } = useOutletContext<{
    activedList: ActivedList
    activedEntry: ActivedEntry
    setActivedEntry: (value: ActivedEntry) => void
  }>()

  useEffect(() => {
    setActivedEntry(null)
  }, [activedList])

  return (
    <>
      <div
        className={cn(
          "pt-10 border-r shrink-0 h-full overflow-y-auto",
          activedList && wideMode.includes(activedList.view)
            ? "flex-1"
            : "w-[340px]",
        )}
      >
        <EntryColumn />
      </div>
      <AnimatePresence>
        {!(activedList && wideMode.includes(activedList.view)) &&
          activedEntry && (
            <div className="flex-1">
              <EntryContent entryId={activedEntry} />
            </div>
          )}
      </AnimatePresence>
    </>
  )
}
