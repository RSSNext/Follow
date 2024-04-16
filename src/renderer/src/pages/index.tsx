import { FeedColumn } from '@renderer/components/feed-column'
import { EntryColumn } from '@renderer/components/entry-column'
import { useState } from 'react'
import { ActivedList } from '@renderer/lib/types'

export function Component() {
  const [activedList, setActivedList] = useState<ActivedList>(null)
  const [activedEntry, setActivedEntry] = useState<number | null>(null)

  return (
    <div className="flex h-full">
      <div className="w-64 pt-10 border-r shrink-0 flex flex-col bg-[#E1E0DF]" onClick={() => setActivedList(null)}>
        <FeedColumn activedList={activedList} setActivedList={setActivedList} />
      </div>
      <div className="w-[340px] pt-10 border-r shrink-0 h-full overflow-y-auto">
        <EntryColumn activedList={activedList} activedEntry={activedEntry} setActivedEntry={setActivedEntry} />
      </div>
      <div className="flex-1 pt-10 px-4">Three</div>
    </div>
  )
}
