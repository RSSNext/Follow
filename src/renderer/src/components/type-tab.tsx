import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@renderer/components/ui/tooltip'
import { useRef, useState } from 'react'
import { useWheel } from '@use-gesture/react'
import { Lethargy } from 'lethargy'
import { cn, clamp } from '@renderer/lib/utils'

function Content({ type }: { type: string }) {
  return (
    <div className="w-80">
      <div>{type}</div>
    </div>
  )
}

const lethargy = new Lethargy()

export function TypeTab() {
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

  const carouselRef = useRef<HTMLDivElement>(null)

  const [active, setActive] = useState(0)
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
            className={cn(item.className, active !== index && 'grayscale')}
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
        <div className="h-full flex transition-transform" style={{ transform: `translateX(${-active * 320}px)` }}>
            {items.map((item) => (
              <section key={item.name} className="snap-center shrink-0">
                <Content type={item.name} />
              </section>
            ))}
        </div>
      </div>
    </TooltipProvider>
  )
}
