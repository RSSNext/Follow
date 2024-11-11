import { Logo } from "@follow/components/icons/logo.js"
import { MotionButtonBase } from "@follow/components/ui/button/index.js"
import { DividerVertical } from "@follow/components/ui/divider/Divider.js"
import { views } from "@follow/constants"
import { stopPropagation } from "@follow/utils/dom"
import clsx from "clsx"
import { m, useAnimationControls } from "framer-motion"
import type { FC } from "react"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { useEventListener } from "usehooks-ts"

import { useSidebarActiveView } from "~/atoms/sidebar"
import { getRouteParams } from "~/hooks/biz/useRouteParams"

import { FeedList } from "../feed-column/list"
import { ProfileButton } from "../user/ProfileButton"
import { FooterInfo } from "./components/FooterInfo"
import styles from "./mobile.module.css"

export function MainMobileLayout() {
  const [active, setActive_] = useSidebarActiveView()

  useLayoutEffect(() => {
    const { view } = getRouteParams()
    if (view !== undefined) {
      setActive_(view)
    }
  }, [setActive_])

  const [feedListScrollRef, setFeedListScrollRef] = useState<HTMLDivElement | null>()

  return (
    <div className={clsx("relative flex h-full flex-col space-y-3", "bg-background")}>
      <div className={"relative flex size-full h-0 grow"}>
        <SwipeWrapper active={active}>
          {views.map((item, index) => (
            <section key={item.name} className="size-full shrink-0 snap-center">
              <FeedList
                ref={setFeedListScrollRef}
                className="flex size-full flex-col text-sm"
                view={index}
              />
            </section>
          ))}
        </SwipeWrapper>
      </div>

      <FooterInfo />
      <FloatBar scrollContainer={feedListScrollRef} />
    </div>
  )
}

const SwipeWrapper: FC<{
  active: number
  children: React.JSX.Element[]
}> = ({ children, active }) => {
  const [currentAnimtedActive, setCurrentAnimatedActive] = useState(active)

  useLayoutEffect(() => {
    // eslint-disable-next-line @eslint-react/web-api/no-leaked-timeout
    setTimeout(() => {
      setCurrentAnimatedActive(active)
    }, 0)
  }, [active])

  return <div className="size-full">{children[currentAnimtedActive]}</div>
}
const FloatBar = ({ scrollContainer }: { scrollContainer: Nullable<HTMLDivElement> }) => {
  const [isScrollDown, setIsScrollDown] = useState(false)
  const prevScrollY = useRef(0)
  useEventListener(
    "scroll",
    () => {
      if (!scrollContainer) return
      const currentY = scrollContainer.scrollTop

      if (currentY < 100) return

      setIsScrollDown(currentY > prevScrollY.current)
      prevScrollY.current = currentY
    },
    { current: scrollContainer! },
  )
  const animateController = useAnimationControls()

  useEffect(() => {
    if (isScrollDown) {
      animateController.start({
        translateY: "calc(100% + 40px)",
        transition: { type: "tween", duration: 0.1 },
      })
    } else {
      animateController.start({
        translateY: 0,
      })
    }
  }, [isScrollDown, animateController])

  return (
    <m.div
      className={clsx(
        "absolute inset-x-0 flex h-10 justify-center will-change-transform bottom-safe-offset-8",
      )}
      transition={{ type: "spring" }}
      animate={animateController}
    >
      <div className={styles["float-bar"]}>
        <Logo className="size-6" />
        <DividerVertical className="h-3/4" />
        <ViewTabs />
        <DividerVertical className="h-3/4" />
        <ProfileButton />
      </div>
    </m.div>
  )
}

const ViewTabs = () => {
  const [active, setActive] = useSidebarActiveView()
  return (
    <div
      className="flex w-full items-center justify-between gap-4 text-xl text-theme-vibrancyFg"
      onClick={stopPropagation}
    >
      {views.map((item) => (
        <MotionButtonBase
          className={clsx(
            "center flex transition-colors duration-200",
            active === item.view && "text-theme-accent",
          )}
          key={item.name}
          onClick={() => setActive(item.view)}
        >
          {item.icon}
        </MotionButtonBase>
      ))}
    </div>
  )
}
