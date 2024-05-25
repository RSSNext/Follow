import { Button } from "@renderer/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@renderer/components/ui/tooltip"
import { UserButton } from "@renderer/components/user-button"
import { levels, views } from "@renderer/lib/constants"
import { clamp, cn } from "@renderer/lib/utils"
import { feedActions } from "@renderer/store"
import { useWheel } from "@use-gesture/react"
import { m, useSpring } from "framer-motion"
import { Lethargy } from "lethargy"
import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"

import { FeedList } from "./list"

const lethargy = new Lethargy()

export function FeedColumn() {
  const { setActiveList } = feedActions
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
            return
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
      className="flex h-full flex-col gap-3"
      onClick={() =>
        setActiveList?.({
          level: levels.view,
          id: active,
          name: views[active].name,
          view: active,
          preventNavigate: true,
        })}
    >
      <div className="ml-5 mr-3 flex items-center justify-between">
        <div
          className="flex items-center gap-1 text-xl font-bold"
          onClick={(e) => {
            e.stopPropagation()
            setActiveList?.({
              level: levels.view,
              id: active,
              name: views[active].name,
              view: active,
            })
          }}
        >
          <img src="./icon.svg" alt="logo" className="size-6" />
          Follow
        </div>
        <div className="flex items-center">
          <Button variant="ghost" size="sm">
            <Link to="/profile" className="flex">
              <UserButton className="h-5 p-0" hideName={true} />
            </Link>
          </Button>
          <Button variant="ghost" size="sm">
            <Link to="/follow" className="flex">
              <i className="i-mingcute-add-line size-5 text-zinc-500" />
            </Link>
          </Button>
        </div>
      </div>
      <div className="flex w-full justify-between px-3 text-xl text-zinc-500">
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
                    setActiveList?.({
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
      <div className="size-full overflow-hidden" ref={carouselRef}>
        <m.div className="flex h-full" style={{ x: spring }}>
          {views.map((item, index) => (
            <section
              key={item.name}
              className="shrink-0 snap-center overflow-y-auto"
            >
              <FeedList className="mb-6 w-64 px-3" view={index} />
            </section>
          ))}
        </m.div>
      </div>
    </div>
  )
}
