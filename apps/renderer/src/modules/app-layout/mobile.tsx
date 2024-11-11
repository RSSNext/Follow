import { views } from "@follow/constants"
import clsx from "clsx"
import type { FC } from "react"
import { useLayoutEffect, useRef, useState } from "react"

import { useSidebarActiveView } from "~/atoms/sidebar"
import { WindowUnderBlur } from "~/components/ui/background"
import { getRouteParams } from "~/hooks/biz/useRouteParams"

import { FeedList } from "../feed-column/list"
import { FooterInfo } from "./components/FooterInfo"

export function MainMobileLayout() {
  const [active, setActive_] = useSidebarActiveView()

  useLayoutEffect(() => {
    const { view } = getRouteParams()
    if (view !== undefined) {
      setActive_(view)
    }
  }, [setActive_])

  return (
    <WindowUnderBlur
      className={clsx(
        "relative flex h-full flex-col space-y-3",

        "bg-zinc-200/80 backdrop-blur dark:bg-neutral-800/80",
      )}
    >
      <div className={"relative flex size-full h-0 grow"}>
        <SwipeWrapper active={active}>
          {views.map((item, index) => (
            <section key={item.name} className="h-full w-feed-col shrink-0 snap-center">
              <FeedList className="flex size-full flex-col text-sm" view={index} />
            </section>
          ))}
        </SwipeWrapper>
      </div>

      <FooterInfo />
    </WindowUnderBlur>
  )
}

const SwipeWrapper: FC<{
  active: number
  children: React.JSX.Element[]
}> = ({ children, active }) => {
  const containerRef = useRef<HTMLDivElement>(null)

  const [currentAnimtedActive, setCurrentAnimatedActive] = useState(active)

  useLayoutEffect(() => {
    // eslint-disable-next-line @eslint-react/web-api/no-leaked-timeout
    setTimeout(() => {
      setCurrentAnimatedActive(active)
    }, 0)
  }, [active])

  return <div ref={containerRef}>{children[currentAnimtedActive]}</div>
}
