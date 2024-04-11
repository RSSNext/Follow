import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@renderer/components/ui/tooltip'
import { m, useScroll, useMotionValueEvent } from 'framer-motion'
import { useRef, useState } from 'react'

function Content({ type }: { type: string }) {
  return (
    <div className="w-80">
      <div>{type}</div>
    </div>
  )
}

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
  const { scrollXProgress } = useScroll({
    container: carouselRef
  })

  const [xProgress, setXProgress] = useState(0)
  useMotionValueEvent(scrollXProgress, "change", (value) => {
    setXProgress(value);
  })

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex text-zinc-500 w-full justify-around text-xl my-2">
        {items.map((item, index) => (
          <m.div
            key={item.name}
            className={item.className}
            style={{
              filter: `grayscale(${Math.min(Math.abs(xProgress - 1 / (items.length - 1) * index) * (items.length - 1), 1) * 100}%)`,
            }}
            onClick={() => {
              if (carouselRef.current) {
                carouselRef.current.scrollTo({
                  left: carouselRef.current.clientWidth * index,
                  behavior: 'smooth'
                })
              }
            }}
          >
            <Tooltip>
              <TooltipTrigger>{item.icon}</TooltipTrigger>
              <TooltipContent side="bottom">{item.name}</TooltipContent>
            </Tooltip>
          </m.div>
        ))}
      </div>
      <div className="w-full h-full flex snap-x snap-mandatory overflow-x-auto" ref={carouselRef}>
          {items.map((item) => (
            <section key={item.name} className="snap-center shrink-0">
              <Content type={item.name} />
            </section>
          ))}
      </div>
    </TooltipProvider>
  )
}
