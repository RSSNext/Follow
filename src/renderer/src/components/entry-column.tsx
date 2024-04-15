import { useEntries } from '@renderer/lib/entries'
import { ActivedList } from '@renderer/lib/types'
import dayjs from '@renderer/lib/dayjs'

export function EntryColumn({ activedList }: { activedList: ActivedList }) {
  const entries = useEntries({
    type: activedList?.level,
    id: activedList?.id
  })

  return (
    <div>
      <div className='ml-7'>
        <div className="font-bold text-lg">{activedList?.name}</div>
        <div className="text-xs font-medium text-zinc-400">
          {entries.data?.pages?.[0].total} Items
        </div>
      </div>
      {entries.data?.pages?.map((page) =>
        page.entries.map((entry) => (
          <div key={entry.id} className="mt-4 flex">
            <img
              src={`https://icons.duckduckgo.com/ip3/${new URL(entry.feed.site_url).host}.ico`}
              className="w-5 h-5 mr-2 rounded-sm mt-1"
            />
            <div className='line-clamp-5 text-sm'>
              <div className='text-zinc-500'>
                {dayjs
                  .duration(dayjs(entry.published_at).diff(dayjs(), 'minute'), 'minute')
                  .humanize()} ago
              </div>
              <div className='font-medium'>{entry.title}</div>
              <div className='text-zinc-500'>{entry.content}</div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
