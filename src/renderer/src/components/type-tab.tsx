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
import { FeedList } from './feed-list'

const lethargy = new Lethargy()

const items = [
  {
    name: 'Articles',
    icon: <i className="i-mingcute-news-fill" />,
    className: 'text-indigo-600'
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

export function TypeTab() {
  const carouselRef = useRef<HTMLDivElement>(null)

  const [active, setActive] = useState(0)
  const spring = useSpring(0, {
    stiffness: 700,
    damping: 40,
  })

  useEffect(() => {
    spring.set(-active * 320)
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
    <TooltipProvider delayDuration={300}>
      <div className="flex text-zinc-500 w-full justify-around text-xl my-2">
        {items.map((item, index) => (
          <div
            key={item.name}
            className={cn(active === index && item.className)}
            onClick={() => {
              setActive(index)
            }}
          >
            <Tooltip>
              <TooltipTrigger>{item.icon}</TooltipTrigger>
              <TooltipContent side="bottom">{item.name}</TooltipContent>
            </Tooltip>
          </div>
        ))}
      </div>
      <div className="w-full h-full overflow-x-hidden" ref={carouselRef}>
        <m.div className="h-full flex" style={{ x: spring }}>
            {items.map((item) => (
              <section key={item.name} className="snap-center shrink-0">
                <FeedList type={item.name} />
              </section>
            ))}
        </m.div>
      </div>
    </TooltipProvider>
  )
}
