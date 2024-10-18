import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { Outlet, useNavigate } from "react-router-dom"

import { getReadonlyRoute } from "~/atoms/route"
import { getSidebarActiveView, setSidebarActiveView } from "~/atoms/sidebar"
import { MotionButtonBase } from "~/components/ui/button"
import { FABContainer, FABPortable } from "~/components/ui/fab"
import { ScrollArea } from "~/components/ui/scroll-area"
import { isElectronBuild } from "~/constants"
import { springScrollTo } from "~/lib/scroller"
import { cn, getOS } from "~/lib/utils"

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
  }, [scrollRef])

  const { t } = useTranslation()

  // electron window has pt-[calc(var(--fo-window-padding-top)_-10px)]
  const isElectronWindows = isElectronBuild && getOS() === "Windows"

  return (
    <div className="relative flex size-full">
      <div
        className={cn(
          "absolute inset-x-0 top-0 z-10 p-4",
          "grid grid-cols-[1fr_auto_1fr] items-center gap-4",
          isTitleSticky && "group border-b bg-zinc-50/80 backdrop-blur-xl dark:bg-neutral-900/90",
          isTitleSticky && isElectronWindows && "-top-5",
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
          <span className="text-sm font-medium">{t("words.back", { ns: "common" })}</span>
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
        viewportClassName="pb-10 pt-28 [&>div]:items-center"
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
