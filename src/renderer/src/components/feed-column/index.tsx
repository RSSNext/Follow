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
import { Link } from "react-router-dom"

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
      className="h-full flex flex-col gap-3"
      onClick={() =>
        setActivedList({
          level: "view",
          id: active,
          name: views[active].name,
          view: active,
          preventNavigate: true,
        })
      }
    >
      <div className="mx-5 flex items-center justify-between">
        <div className="font-bold text-xl">ReadOK</div>
        <div className="flex items-center gap-2">
          <Link to={`/profile`} className="flex">
            <UserButton className="h-5 p-0" hideName={true} />
          </Link>
          <Link to={`/subscribe`} className="flex">
            <i className="i-mingcute-add-circle-line h-5 w-5 text-zinc-500" />
          </Link>
        </div>
      </div>
      <div className="flex text-zinc-500 w-full justify-between text-xl px-5">
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
                <TooltipTrigger className="flex items-center my-2">
                  {item.icon}
                </TooltipTrigger>
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
