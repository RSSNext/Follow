import { useEntries } from '@renderer/lib/entries'
import { ActivedList } from '@renderer/lib/types'
import { m } from 'framer-motion'
import { cn } from '@renderer/lib/utils'
import { ArticleItem } from './article-item'

export function EntryColumn({
  activedList,
  activedEntry,
  setActivedEntry,
}: {
  activedList: ActivedList,
  activedEntry: number | null,
  setActivedEntry: (value: number | null) => void
}) {
  const entries = useEntries({
    type: activedList?.level,
    id: activedList?.id
  })

  return (
    <div className='px-2' onClick={() => setActivedEntry(null)}>
      <div className="ml-9">
        <div className="font-bold text-lg">{activedList?.name}</div>
        <div className="text-xs font-medium text-zinc-400">
          {entries.data?.pages?.[0].total} Items
        </div>
      </div>
      <div>
        {entries.data?.pages?.map((page, index) => (
          <m.div
            key={`${activedList?.level}-${activedList?.id}-${index}`}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
          >
            {page.entries.map((entry) => (
              <div
                key={entry.id}
                className={cn("mt-5 flex px-2 py-3 rounded-md cursor-pointer", activedEntry === entry.id && 'bg-[#DEDDDC]')}
                onClick={(e) => {
                  e.stopPropagation()
                  setActivedEntry(entry.id)
                }}
              >
                <ArticleItem entry={entry} />
              </div>
            ))}
          </m.div>
        ))}
      </div>
    </div>
  )
}
