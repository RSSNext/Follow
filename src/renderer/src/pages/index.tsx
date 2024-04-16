import { FeedColumn } from '@renderer/components/feed-column'
import { EntryColumn } from '@renderer/components/entry-column'
import { useState } from 'react'
import { ActivedList } from '@renderer/lib/types'
import { cn } from '@renderer/lib/utils'

export function Component() {
  const [activedList, setActivedList] = useState<ActivedList>({
    level: 'type',
    id: 'Articles',
    name: 'Articles',
    type: 'Articles',
  })
  const [activedEntry, setActivedEntry] = useState<number | null>(null)

  return (
    <div className="flex h-full">
      <div className="w-64 pt-10 border-r shrink-0 bg-[#E1E0DF]">
        <FeedColumn activedList={activedList} setActivedList={setActivedList} />
      </div>
      <div className={cn("pt-10 border-r shrink-0 h-full overflow-y-auto", activedList?.type === "Social Media" ? "flex-1 min-w-96" : "w-[340px]")}>
        <EntryColumn activedList={activedList} activedEntry={activedEntry} setActivedEntry={setActivedEntry} />
      </div>
      <div className="flex-1 pt-10 px-4">Three</div>
    </div>
  )
}
