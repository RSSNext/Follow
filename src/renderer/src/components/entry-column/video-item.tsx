import dayjs from '@renderer/lib/dayjs'
import { SiteIcon } from '../site-icon'

export function VideoItem({
  entry,
}: {
  entry: any,
}) {
  return (
    <div className='flex'>
      <div>
        <div className='flex gap-2 overflow-x-auto'>
          {entry.images?.slice(0, 1).map((image) => (
            <img
              key={image}
              src={image}
              className="w-full aspect-video shrink-0 rounded object-cover"
              loading="lazy"
            />
          ))}
        </div>
        <div className="line-clamp-5 text-sm flex-1 px-2 pb-3 pt-1">
          <div className="font-medium line-clamp-2">{entry.title}</div>
          <div className='space-x-1 text-[13px]'>
            <SiteIcon className='w-3.5 h-3.5 inline-block mr-0 align-sub' url={entry.feed.site_url} />
            <span>{entry.author}</span>
            <span className="text-zinc-500">·</span>
            <span className="text-zinc-500">
              {dayjs
                .duration(dayjs(entry.published_at).diff(dayjs(), 'minute'), 'minute')
                .humanize()}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
