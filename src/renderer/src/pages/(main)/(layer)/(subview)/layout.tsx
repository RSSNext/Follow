import { getReadonlyRoute } from "@renderer/atoms/route"
import { getSidebarActiveView, setSidebarActiveView } from "@renderer/atoms/sidebar"
import { MotionButtonBase } from "@renderer/components/ui/button"
import { FABContainer, FABPortable } from "@renderer/components/ui/fab"
import { ScrollArea } from "@renderer/components/ui/scroll-area"
import { springScrollTo } from "@renderer/lib/scroller"
import { cn } from "@renderer/lib/utils"
import { useEffect, useRef, useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"

import { useSubViewTitleValue } from "./hooks"

export function Component() {
  const navigate = useNavigate()
  const prevLocation = useRef(getReadonlyRoute().location).current
  const prevView = useRef(getSidebarActiveView()).current
  const title = useSubViewTitleValue()
  const [scrollRef, setRef] = useState(null as HTMLDivElement | null)
  const [isTitleSticky, setIsTitleSticky] = useState(false)

  useEffect(() => {
    const $scroll = scrollRef

    if (!$scroll) return

    springScrollTo(0, $scroll)
    const handler = () => {
      setIsTitleSticky($scroll.scrollTop > 120)
    }
    $scroll.addEventListener("scroll", handler)
    return () => {
      $scroll.removeEventListener("scroll", handler)
    }
  }, [scrollRef, title])

  return (
    <div className="relative flex size-full">
      <div
        className={cn(
          "absolute inset-x-0 top-0 z-10 p-4",
          "grid grid-cols-[1fr_auto_1fr] items-center gap-4",
          isTitleSticky && "group border-b bg-zinc-50/80 backdrop-blur-xl dark:bg-neutral-900/90",
        )}
      >
        <MotionButtonBase
          onClick={() => {
            navigate(prevLocation)

            setSidebarActiveView(prevView)
          }}
          className="no-drag-region inline-flex items-center gap-1 duration-200 hover:text-accent"
        >
          <i className="i-mingcute-left-line" />
          <span className="text-sm font-medium">Back</span>
        </MotionButtonBase>
        <div>
          <div className="font-bold opacity-0 duration-200 group-[.group]:opacity-100">{title}</div>
        </div>
        <div />
      </div>

      <ScrollArea.ScrollArea
        mask={false}
        flex
        ref={setRef}
        rootClassName="w-full"
        viewportClassName="pb-10 pt-40 [&>div]:items-center [&>div]:gap-8"
      >
        <Outlet />
      </ScrollArea.ScrollArea>

      <FABContainer>
        <BackToTopFAB show={isTitleSticky} scrollRef={scrollRef} />
      </FABContainer>
    </div>
  )
}

const BackToTopFAB = ({ show, scrollRef }: { show: boolean; scrollRef: any }) => {
  return (
    <FABPortable
      onClick={() => {
        springScrollTo(0, scrollRef)
      }}
      show={show}
    >
      <i className="i-mingcute-arow-to-up-line" />
    </FABPortable>
  )
}
