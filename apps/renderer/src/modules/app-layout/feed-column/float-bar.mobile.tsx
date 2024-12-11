import { Logo } from "@follow/components/icons/logo.js"
import { MotionButtonBase } from "@follow/components/ui/button/index.js"
import { DividerVertical } from "@follow/components/ui/divider/Divider.js"
import { views } from "@follow/constants"
import { stopPropagation } from "@follow/utils/dom"
import clsx from "clsx"
import { m, useAnimationControls } from "framer-motion"
import { useCallback, useEffect, useRef, useState } from "react"

import { useAudioPlayerAtomSelector } from "~/atoms/player"
import { useUISettingKey } from "~/atoms/settings/ui"
import { useSidebarActiveView } from "~/atoms/sidebar"
import { FeedIcon } from "~/modules/feed/feed-icon"
import { CornerPlayer } from "~/modules/player/corner-player"
import { useEntry } from "~/store/entry"
import { useFeedById } from "~/store/feed"
import { feedIconSelector } from "~/store/feed/selector"
import { useUnreadByView } from "~/store/unread/hooks"

import { ProfileButton } from "../../user/ProfileButton"

export const MobileFloatBar = ({
  scrollContainer,
  className,
  onLogoClick,
  onViewChange,
}: {
  scrollContainer: Nullable<HTMLDivElement>
  className?: string
  onLogoClick?: () => void
  onViewChange?: (view: number) => void
}) => {
  const [isScrollDown, setIsScrollDown] = useState(false)
  const prevScrollY = useRef(0)
  useEffect(() => {
    if (!scrollContainer) return

    const handler = () => {
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
    }
    scrollContainer.addEventListener("scroll", handler)
    return () => scrollContainer.removeEventListener("scroll", handler)
  }, [scrollContainer])

  const animateController = useAnimationControls()

  useEffect(() => {
    if (isScrollDown) {
      const computedStyle = getComputedStyle(document.documentElement)
      const safeAreaBottom = computedStyle.getPropertyValue("--sab")
      animateController.start({
        translateY: `calc(100% + 40px + ${safeAreaBottom})`,
        transition: { type: "tween", duration: 0.1 },
      })
    } else {
      animateController.start({
        translateY: 0,
      })
    }
  }, [isScrollDown, animateController])

  return (
    <div
      className={clsx(
        "pointer-events-none absolute inset-x-0 bottom-0 flex h-36 items-end overflow-hidden pb-safe-offset-6",
        className,
      )}
    >
      <m.div
        className={clsx(
          "mx-auto inline-flex h-10 min-w-0 items-center rounded-full border border-neutral-200 bg-background pl-4 pr-2 shadow-sm shadow-zinc-100 dark:border-neutral-800",
          "[box-shadow:0px_8px_30px_rgba(122,122,122,0.2)] dark:[box-shadow:0px_8px_30px_rgba(122,122,122,0.2)]",
          "pointer-events-auto",
        )}
        transition={{ type: "spring" }}
        animate={animateController}
      >
        <PlayerIcon isScrollDown={isScrollDown} onLogoClick={onLogoClick} />
        <DividerVertical className="h-3/4 shrink-0" />
        <ViewTabs onViewChange={onViewChange} />
        <DividerVertical className="h-3/4 shrink-0" />
        <ProfileButton />
      </m.div>
    </div>
  )
}

const ViewTabs = ({ onViewChange }: { onViewChange?: (view: number) => void }) => {
  const [active, setActive] = useSidebarActiveView()
  const unreadByView = useUnreadByView()
  const showCount = useUISettingKey("sidebarShowUnreadCount")
  return (
    <div
      className="flex w-full shrink items-center justify-between gap-4 overflow-x-auto overflow-y-hidden text-xl text-theme-vibrancyFg"
      onClick={stopPropagation}
    >
      {views.map((item) => (
        <MotionButtonBase
          className={clsx(
            "center flex transition-colors duration-200",
            active === item.view && item.className,
          )}
          key={item.name}
          onClick={() => {
            setActive(item.view)
            onViewChange?.(item.view)
          }}
        >
          <div className="relative flex flex-col items-center">
            {item.icon}

            {showCount && (
              <span className="mt-px text-[8px] leading-none">
                {unreadByView[item.view] > 99 ? "99+" : unreadByView[item.view] || "0"}
              </span>
            )}
          </div>
        </MotionButtonBase>
      ))}
    </div>
  )
}

const PlayerIcon = ({
  isScrollDown,
  onLogoClick,
}: {
  isScrollDown: boolean
  onLogoClick?: () => void
}) => {
  const { isPlaying, entryId } = useAudioPlayerAtomSelector(
    useCallback((state) => ({ isPlaying: state.status === "playing", entryId: state.entryId }), []),
  )
  const feedId = useEntry(entryId, (s) => s.feedId)
  const feed = useFeedById(feedId, feedIconSelector)
  const [isShowPlayer, setIsShowPlayer] = useState(false)
  if (!feed || !isPlaying) {
    return (
      <MotionButtonBase onClick={onLogoClick}>
        <Logo className="size-5 shrink-0" />
      </MotionButtonBase>
    )
  }

  return (
    <>
      <button type="button" className="size-5 shrink-0" onClick={() => setIsShowPlayer((v) => !v)}>
        <FeedIcon feed={feed} noMargin />
      </button>

      {isShowPlayer && !isScrollDown && (
        <CornerPlayer
          className="absolute inset-x-0 mx-auto w-full max-w-[350px] bottom-safe-or-12"
          hideControls
          rounded
        />
      )}
    </>
  )
}
