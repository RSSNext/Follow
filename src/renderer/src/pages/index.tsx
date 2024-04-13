import { FeedColumn } from '@renderer/components/feed-column'
import { useState } from 'react'
import { ActivedList } from '@renderer/lib/types'

export function Component() {
  const [activedList, setActivedList] = useState<ActivedList>(null)

  return (
    <div className="flex h-full">
      <div className="w-64 pt-10 border-r shrink-0 flex flex-col bg-[#E1E0DF]" onClick={() => setActivedList(null)}>
        <FeedColumn activedList={activedList} setActivedList={setActivedList} />
      </div>
      <div className="w-80 pt-10 px-5 border-r shrink-0">Two</div>
      <div className="flex-1 pt-10 px-5">Three</div>
    </div>
  )
}
