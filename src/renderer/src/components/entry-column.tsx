import { useEntries } from '@renderer/lib/entries'
import { ActivedList } from '@renderer/lib/types'
import dayjs from '@renderer/lib/dayjs'
import { m } from 'framer-motion'

export function EntryColumn({ activedList }: { activedList: ActivedList }) {
  const entries = useEntries({
    type: activedList?.level,
    id: activedList?.id
  })

  return (
    <div>
      <div className="ml-7">
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
              <div key={entry.id} className="mt-5 flex">
                <img
                  src={`https://icons.duckduckgo.com/ip3/${new URL(entry.feed.site_url).host}.ico`}
                  className="w-5 h-5 mr-2 rounded-sm shrink-0"
                />
                <div className="line-clamp-5 text-sm flex-1 -mt-1">
                  <div className="text-zinc-500 text-[13px]">
                    {dayjs
                      .duration(dayjs(entry.published_at).diff(dayjs(), 'minute'), 'minute')
                      .humanize()}{' '}
                    ago
                  </div>
                  <div className="font-medium">{entry.title}</div>
                  <div className="text-zinc-500 text-[13px]">{entry.text}</div>
                </div>
                {entry.images?.[0] && (
                  <img
                    src={entry.images[0]}
                    className="w-14 h-14 shrink-0 ml-2 rounded object-cover"
                    loading="lazy"
                  />
                )}
              </div>
            ))}
          </m.div>
        ))}
      </div>
    </div>
  )
}
