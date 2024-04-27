import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@renderer/components/ui/tooltip"
import { useEffect, useRef, useState } from "react"
import { useWheel } from "@use-gesture/react"
import { Lethargy } from "lethargy"
import { cn, clamp } from "@renderer/lib/utils"
import { m, useSpring } from "framer-motion"
import { FeedList } from "./list"
import { ActivedList } from "@renderer/lib/types"
import { UserButton } from "@renderer/components/user-button"
import { views } from "@renderer/lib/constants"

const lethargy = new Lethargy()

export function FeedColumn({
  activedList,
  setActivedList,
}: {
  activedList: ActivedList
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

  useWheel(
    ({ event, last, memo: wait = false, direction: [dx], delta: [dex] }) => {
      if (!last) {
        const s = lethargy.check(event)
        if (s) {
          if (!wait && Math.abs(dex) > 20) {
            setActive((i) => clamp(i + dx, 0, views.length - 1))
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
    },
    {
      target: carouselRef,
    },
  )

  return (
    <div
      className="h-full flex flex-col"
      onClick={() =>
        setActivedList({
          level: "view",
          id: active,
          name: views[active].name,
          view: active,
        })
      }
    >
      <UserButton className="h-12 mx-3 mb-2 mt-1" />
      <div className="flex text-zinc-500 w-full justify-between text-xl my-2 px-5">
        <TooltipProvider delayDuration={300}>
          {views.map((item, index) => (
            <div
              key={item.name}
              className={cn(active === index && "text-zinc-800")}
              onClick={(e) => {
                setActive(index)
                setActivedList({
                  level: "view",
                  id: index,
                  name: views[index].name,
                  view: index,
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
          {views.map((item, index) => (
            <section key={item.name} className="snap-center shrink-0">
              <FeedList
                view={index}
                activedList={activedList}
                setActivedList={setActivedList}
              />
            </section>
          ))}
        </m.div>
      </div>
    </div>
  )
}
