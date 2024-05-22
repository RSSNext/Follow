import { FeedColumn } from "@renderer/components/feed-column"
import { ActivedEntry, ActivedList } from "@renderer/lib/types"
import { Outlet, useOutletContext } from "react-router-dom"

export function Component() {
  const { activedList, setActivedList, activedEntry, setActivedEntry } =
    useOutletContext<{
      activedList: ActivedList
      setActivedList: (value: ActivedList) => void
      activedEntry: ActivedEntry
      setActivedEntry: (value: ActivedEntry) => void
    }>()

  return (
    <div className="flex h-full">
      <div className="w-64 pt-10 border-r shrink-0 bg-native">
        <FeedColumn />
      </div>
      <Outlet
        context={{
          activedList,
          activedEntry,
          setActivedEntry,
          setActivedList,
        }}
      />
    </div>
  )
}
