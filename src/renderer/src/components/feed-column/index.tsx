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
import { levels, views } from "@renderer/lib/constants"
import { Link } from "react-router-dom"
import { Button } from "@renderer/components/ui/button"

const lethargy = new Lethargy()

export function FeedColumn({
  activedList,
  setActivedList,
}: {
  activedList?: ActivedList
  setActivedList?: (value: ActivedList) => void
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
        setActivedList?.({
          level: levels.view,
          id: active,
          name: views[active].name,
          view: active,
          preventNavigate: true,
        })
      }
    >
      <div className="ml-5 mr-3 flex items-center justify-between">
        <div className="font-bold text-xl flex items-center gap-1">
          <img src="./icon.svg" alt="logo" className="h-5 w-5" />
          Follow
        </div>
        <div className="flex items-center">
          <Button variant="ghost" size="sm">
            <Link to={`/profile`} className="flex">
              <UserButton className="h-5 p-0" hideName={true} />
            </Link>
          </Button>
          <Button variant="ghost" size="sm">
            <Link to={`/follow`} className="flex">
              <i className="i-mingcute-add-line h-5 w-5 text-zinc-500" />
            </Link>
          </Button>
        </div>
      </div>
      <div className="flex text-zinc-500 w-full justify-between text-xl px-3">
        <TooltipProvider>
          {views.map((item, index) => (
            <Tooltip key={item.name}>
              <TooltipTrigger asChild>
                <Button
                  className={cn(
                    active === index && item.className,
                    "flex items-center text-xl",
                  )}
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    setActive(index)
                    setActivedList?.({
                      level: "view",
                      id: index,
                      name: views[index].name,
                      view: index,
                    })
                    e.stopPropagation()
                  }}
                >
                  {item.icon}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">{item.name}</TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>
      <div className="w-full h-full overflow-clip" ref={carouselRef}>
        <m.div className="h-full flex" style={{ x: spring }}>
          {views.map((item, index) => (
            <section
              key={item.name}
              className="snap-center shrink-0 overflow-y-auto"
            >
              <FeedList
                className="w-64 px-3 mb-6"
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
