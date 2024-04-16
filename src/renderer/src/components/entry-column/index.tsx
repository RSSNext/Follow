import { useEntries } from '@renderer/lib/entries'
import { ActivedList, ActivedEntry } from '@renderer/lib/types'
import { m } from 'framer-motion'
import { cn } from '@renderer/lib/utils'
import { ArticleItem } from './article-item'
import { SocialMediaItem } from './social-media-item'
import { PictureItem } from './picture-item'
import { VideoItem } from './video-item'
import { NotificationItem } from './notification-item'

const gridMode = ['Pictures', 'Videos']

export function EntryColumn({
  activedList,
  activedEntry,
  setActivedEntry,
}: {
  activedList: ActivedList,
  activedEntry: ActivedEntry,
  setActivedEntry: (value: ActivedEntry) => void
}) {
  const entries = useEntries({
    level: activedList?.level,
    id: activedList?.id
  })

  let Item;
  switch (activedList?.type) {
    case 'Articles':
      Item = ArticleItem
      break
    case 'Social Media':
      Item = SocialMediaItem
      break
    case 'Pictures':
      Item = PictureItem
      break
    case 'Videos':
      Item = VideoItem
      break
    case 'Notifications':
      Item = NotificationItem
      break
    default:
      Item = ArticleItem
  }

  return (
    <div className='px-2' onClick={() => setActivedEntry(null)}>
      <div className="ml-9 mb-5">
        <div className="font-bold text-lg">{activedList?.name}</div>
        <div className="text-xs font-medium text-zinc-400">
          {entries.data?.pages?.[0].total} Items
        </div>
      </div>
      <div>
        {entries.data?.pages?.map((page, index) => (
          <m.div
            key={`${activedList?.level}-${activedList?.id}-${index}`}
            transition={{
              type: 'tween',
              duration: 0.1,
              ease: 'easeInOut',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn(
              gridMode.includes(activedList?.type || '') && 'grid gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-2'
            )}
          >
            {page.entries.map((entry) => (
              <div
                key={entry.id}
                className={cn("rounded-md cursor-pointer", activedEntry?.id === entry.id && 'bg-[#DEDDDC]')}
                onClick={(e) => {
                  e.stopPropagation()
                  setActivedEntry(entry)
                }}
              >
                <Item entry={entry} />
              </div>
            ))}
          </m.div>
        ))}
      </div>
    </div>
  )
}
