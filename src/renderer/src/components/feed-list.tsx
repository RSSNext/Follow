import { useFeeds } from '@renderer/lib/feeds'
import { Collapsible, CollapsibleTrigger } from '@renderer/components/ui/collapsible'
import { m, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

export function FeedList({ type }: { type: string }) {
  const feeds = useFeeds()

  return (
    <div className="w-64 px-5">
      <div className='flex items-center justify-between mt-2 mb-3'>
        <div className="font-bold">{type}</div>
        <div className='text-sm text-zinc-500 ml-2'>{feeds.data?.unread}</div>
      </div>
      {Object.keys(feeds.data?.list || {}).map((category) => (
        <FeedCategory key={category} name={category} data={feeds.data?.list[category]} />
      ))}
    </div>
  )
}

function FeedCategory({ name, data }: { name: string; data: any }) {
  const [open, setOpen] = useState(false)

  return (
    <Collapsible
      open={open}
      onOpenChange={(o) => setOpen(o)}
    >
      <CollapsibleTrigger className="flex items-center justify-between font-medium text-sm leading-loose py-[2px] w-full [&_.i-mingcute-right-fill]:data-[state=open]:rotate-90">
        <div className='flex items-center min-w-0'>
          <i className="i-mingcute-right-fill mr-2 transition-transform" />
          <span className='truncate'>{name}</span>
        </div>
        {!!data.unread && <div className='text-xs text-zinc-500 ml-2'>{data.unread}</div>}
      </CollapsibleTrigger>
      <AnimatePresence>
        {open && (
          <m.div
            transition={{
              type: 'tween',
              duration: 0.2,
              ease: 'easeInOut',
            }}
            key={name}
            className="overflow-hidden"
            initial={{
              height: 0,
              opacity: 0
            }}
            animate={{
              height: 'auto',
              opacity: 1
            }}
            exit={{
              height: 0,
              opacity: 0
            }}
          >
            {data.list.map((feed) => (
              <div
                key={feed.id}
                className="flex items-center justify-between my-2 text-sm font-medium leading-loose w-full pl-6"
              >
                <div className='flex items-center min-w-0'>
                  <img
                    src={`https://icons.duckduckgo.com/ip3/${new URL(feed.site_url).host}.ico`}
                    className="w-4 h-4 mr-2 rounded-sm"
                  />
                  <div className='truncate'>{feed.title}</div>
                </div>
                {!!feed.unread && <div className='text-xs text-zinc-500 ml-2'>{feed.unread}</div>}
              </div>
            ))}
          </m.div>
        )}
      </AnimatePresence>
    </Collapsible>
  )
}
