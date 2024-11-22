import { Logo } from "@follow/components/icons/logo.js"
import { MotionButtonBase } from "@follow/components/ui/button/index.js"
import { DividerVertical } from "@follow/components/ui/divider/Divider.js"
import { views } from "@follow/constants"
import { stopPropagation } from "@follow/utils/dom"
import clsx from "clsx"
import { m, useAnimationControls } from "framer-motion"
import { useCallback, useEffect, useRef, useState } from "react"
import { useEventListener } from "usehooks-ts"

import { useAudioPlayerAtomSelector } from "~/atoms/player"
import { useSidebarActiveView } from "~/atoms/sidebar"
import { FeedIcon } from "~/modules/feed/feed-icon"
import { CornerPlayer } from "~/modules/player/corner-player"
import { useEntry } from "~/store/entry"
import { useFeedById } from "~/store/feed"
import { feedIconSelector } from "~/store/feed/selector"

import { ProfileButton } from "../../user/ProfileButton"
import styles from "./mobile.module.css"

export const MobileFloatBar = ({
  scrollContainer,
  className,
  onLogoClick,
}: {
  scrollContainer: Nullable<HTMLDivElement>
  className?: string
  onLogoClick?: () => void
}) => {
  const [isScrollDown, setIsScrollDown] = useState(false)
  const prevScrollY = useRef(0)
  useEventListener(
    "scroll",
    () => {
      if (!scrollContainer) return
      const currentY = scrollContainer.scrollTop

      if (currentY < 30) return

      const isScrollEnd =
        scrollContainer.scrollHeight - currentY - scrollContainer.clientHeight < 10

      if (isScrollEnd) {
        setIsScrollDown(true)
        return
      }

      setIsScrollDown(currentY > prevScrollY.current)
      prevScrollY.current = currentY
    },
    { current: scrollContainer! },
  )
  const animateController = useAnimationControls()

  useEffect(() => {
    if (isScrollDown) {
      animateController.start({
        translateY: "calc(100% + 40px + env(safe-area-inset-bottom))",
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
        className,
      )}
      transition={{ type: "spring" }}
      animate={animateController}
    >
      <div className={styles["float-bar"]}>
        <MotionButtonBase onClick={onLogoClick}>
          <Logo className="size-5 shrink-0" />
        </MotionButtonBase>
        <DividerVertical className="h-3/4 shrink-0" />
        <ViewTabs />
        <DividerVertical className="h-3/4 shrink-0" />
        <PlayerIcon />
        <ProfileButton />
      </div>
    </m.div>
  )
}

const ViewTabs = () => {
  const [active, setActive] = useSidebarActiveView()
  return (
    <div
      className="flex w-full shrink items-center justify-between gap-4 overflow-auto text-xl text-theme-vibrancyFg"
      onClick={stopPropagation}
    >
      {views.map((item) => (
        <MotionButtonBase
          className={clsx(
            "center flex transition-colors duration-200",
            active === item.view && item.className,
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

const PlayerIcon = () => {
  const { isPlaying, entryId } = useAudioPlayerAtomSelector(
    useCallback((state) => ({ isPlaying: state.status === "playing", entryId: state.entryId }), []),
  )
  const feedId = useEntry(entryId, (s) => s.feedId)
  const feed = useFeedById(feedId, feedIconSelector)
  const [isShowPlayer, setIsShowPlayer] = useState(false)
  if (!feed) return null
  if (!isPlaying) return null
  return (
    <>
      <button
        type="button"
        className="mr-3 size-5 shrink-0"
        onClick={() => setIsShowPlayer((v) => !v)}
      >
        <FeedIcon feed={feed} />
      </button>

      {isShowPlayer && (
        <CornerPlayer className="absolute bottom-12 left-0 w-full max-w-[350px] overflow-hidden rounded-r-lg" />
      )}
    </>
  )
}
