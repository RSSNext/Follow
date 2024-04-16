import dayjs from '@renderer/lib/dayjs'
import { SiteIcon } from '../site-icon'

export function ArticleItem({
  entry,
}: {
  entry: any,
}) {
  return (
    <div className='flex my-5 px-2 py-3'>
      <SiteIcon url={entry.feed.site_url} />
      <div className="line-clamp-5 text-sm flex-1 -mt-0.5 leading-tight">
        <div className="text-zinc-500 text-[13px]">
          {dayjs
            .duration(dayjs(entry.published_at).diff(dayjs(), 'minute'), 'minute')
            .humanize()}
        </div>
        <div className="font-medium">{entry.title}</div>
        <div className="text-zinc-500 text-[13px] mt-0.5">{entry.text}</div>
      </div>
      {entry.images?.[0] && (
        <img
          src={entry.images[0]}
          className="w-20 h-20 shrink-0 ml-2 rounded object-cover"
          loading="lazy"
        />
      )}
    </div>
  )
}
