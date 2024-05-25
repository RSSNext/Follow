import { EntryColumn } from "@renderer/components/entry-column"
import { EntryContent } from "@renderer/components/entry-content"
import { useMainLayoutContext } from "@renderer/contexts/outlet/main-layout"
import { cn } from "@renderer/lib/utils"
import { AnimatePresence } from "framer-motion"
import { useEffect } from "react"

const wideMode = [1, 2, 3, 4]

export function Component() {
  const { activeList, activeEntry, setActiveEntry } = useMainLayoutContext()
  useEffect(() => {
    setActiveEntry(null)
  }, [activeList])

  return (
    <>
      <div
        className={cn(
          "h-full shrink-0 overflow-y-auto border-r pt-10",
          activeList && wideMode.includes(activeList.view)
            ? "flex-1"
            : "w-[340px]",
        )}
      >
        <EntryColumn />
      </div>
      <AnimatePresence>
        {!(activeList && wideMode.includes(activeList.view)) && activeEntry && (
          <div className="flex-1">
            <EntryContent entryId={activeEntry} />
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
