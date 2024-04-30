import { FeedColumn } from "@renderer/components/feed-column"
import { useEffect, useState } from "react"
import { ActivedList, ActivedEntry } from "@renderer/lib/types"
import { Outlet } from "react-router-dom"

export function Component() {
  const [activedList, setActivedList] = useState<ActivedList>({
    level: "view",
    id: 0,
    name: "Articles",
    view: 0,
  })
  const [activedEntry, setActivedEntry] = useState<ActivedEntry>(null)

  useEffect(() => {
    setActivedEntry(null)
  }, [activedList])

  return (
    <div className="flex h-full">
      <div className="w-64 pt-10 border-r shrink-0 bg-[#E1E0DF]">
        <FeedColumn activedList={activedList} setActivedList={setActivedList} />
      </div>
      <Outlet
        context={{
          activedList,
          activedEntry,
          setActivedEntry,
        }}
      />
    </div>
  )
}
