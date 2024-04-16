import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@renderer/components/ui/tooltip'
import { useEffect, useRef, useState } from 'react'
import { useWheel } from '@use-gesture/react'
import { Lethargy } from 'lethargy'
import { cn, clamp } from '@renderer/lib/utils'
import { m, useSpring } from "framer-motion"
import { FeedList } from './list'
import { ActivedList } from '@renderer/lib/types'

const lethargy = new Lethargy()

const items = [
  {
    name: 'Articles',
    icon: <i className="i-mingcute-news-fill" />,
    className: 'text-amber-700'
  },
  {
    name: 'Social Media',
    icon: <i className="i-mingcute-twitter-fill" />,
    className: 'text-sky-600'
  },
  {
    name: 'Pictures',
    icon: <i className="i-mingcute-pic-fill" />,
    className: 'text-green-600'
  },
  {
    name: 'Videos',
    icon: <i className="i-mingcute-youtube-fill" />,
    className: 'text-red-600'
  },
  {
    name: 'Audios',
    icon: <i className="i-mingcute-headphone-fill" />,
    className: 'text-purple-600'
  },
  {
    name: 'Notifications',
    icon: <i className="i-mingcute-notification-fill" />,
    className: 'text-yellow-600'
  }
]

export function FeedColumn({
  activedList,
  setActivedList,
}: {
  activedList: ActivedList,
  setActivedList: (value: ActivedList) => void
}) {
  const carouselRef = useRef<HTMLDivElement>(null)

  const [active, setActive] = useState(0)
  const spring = useSpring(0, {
    stiffness: 700,
    damping: 40,
  })

  useEffect(() => {
    spring.set(-active * 256)
  }, [active])

  useWheel(({ event, last, memo: wait = false, direction: [dx], delta: [dex] }) => {
    if (!last) {
      const s = lethargy.check(event)
      if (s) {
        if (!wait && Math.abs(dex) > 20) {
          setActive((i) => clamp(i + dx, 0, items.length - 1))
          return true
        } else {
          return undefined
        }
      } else {
        return false
      }
    } else {
      return false
    }
  }, {
    target: carouselRef,
  })

  return (
    <div className='h-full flex flex-col' onClick={() => setActivedList({
      level: 'type',
      id: items[active].name,
      name: items[active].name,
      type: items[active].name,
    })}>
      <div className="flex text-zinc-500 w-full justify-between text-xl my-2 px-5">
        <TooltipProvider delayDuration={300}>
        {items.map((item, index) => (
          <div
            key={item.name}
            className={cn(active === index && "text-zinc-800")}
            onClick={(e) => {
              setActive(index)
              setActivedList({
                level: 'type',
                id: items[index].name,
                name: items[index].name,
                type: items[index].name,
              })
              e.stopPropagation()
            }}
          >
            <Tooltip>
              <TooltipTrigger>{item.icon}</TooltipTrigger>
              <TooltipContent side="bottom">{item.name}</TooltipContent>
            </Tooltip>
          </div>
        ))}
        </TooltipProvider>
      </div>
      <div className="w-full h-full overflow-x-hidden" ref={carouselRef}>
        <m.div className="h-full flex" style={{ x: spring }}>
            {items.map((item) => (
              <section key={item.name} className="snap-center shrink-0">
                <FeedList type={item.name} activedList={activedList} setActivedList={setActivedList} />
              </section>
            ))}
        </m.div>
      </div>
    </div>
  )
}
