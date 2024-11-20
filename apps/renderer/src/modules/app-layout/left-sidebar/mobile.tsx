import { Logo } from "@follow/components/icons/logo.js"
import { ActionButton, MotionButtonBase } from "@follow/components/ui/button/index.js"
import { DividerVertical } from "@follow/components/ui/divider/Divider.js"
import { RootPortal } from "@follow/components/ui/portal/index.js"
import { views } from "@follow/constants"
import { IN_ELECTRON } from "@follow/shared/constants"
import { stopPropagation } from "@follow/utils/dom"
import clsx from "clsx"
import { m, useAnimationControls } from "framer-motion"
import type { FC } from "react"
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { useEventListener } from "usehooks-ts"

import { useAudioPlayerAtomSelector } from "~/atoms/player"
import { useSidebarActiveView } from "~/atoms/sidebar"
import { useLoginModalShow, useWhoami } from "~/atoms/user"
import { PlainModal } from "~/components/ui/modal/stacked/custom-modal"
import { DeclarativeModal } from "~/components/ui/modal/stacked/declarative-modal"
import { useDailyTask } from "~/hooks/biz/useDailyTask"
import { getRouteParams } from "~/hooks/biz/useRouteParams"
import { LoginModalContent } from "~/modules/auth/LoginModalContent"
import { FeedIcon } from "~/modules/feed/feed-icon"
import { CornerPlayer } from "~/modules/player/corner-player"
import { useEntry } from "~/store/entry"
import { useFeedById } from "~/store/feed"
import { feedIconSelector } from "~/store/feed/selector"

import { FeedList } from "../../feed-column/list"
import { ProfileButton } from "../../user/ProfileButton"
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

  useDailyTask()

  const isAuthFail = useLoginModalShow()
  const user = useWhoami()

  const { t } = useTranslation()
  return (
    <div className={"relative flex h-screen flex-col space-y-3"}>
      <div className="mt-4 flex items-center justify-between pl-6 pr-2">
        <span className="inline-flex items-center gap-3 text-lg font-bold">
          <Logo className="size-8 shrink-0" />
          {APP_NAME}
        </span>
        <div className="center inline-flex">
          <Link to="/discover" tabIndex={-1}>
            <ActionButton shortcut="Meta+T" tooltip={t("words.discover")}>
              <i className="i-mgc-add-cute-re size-5 text-theme-vibrancyFg" />
            </ActionButton>
          </Link>
          {/* <SearchTrigger /> */}
        </div>
      </div>
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

      {isAuthFail && !user && (
        <RootPortal>
          <DeclarativeModal
            id="login"
            CustomModalComponent={PlainModal}
            open
            overlay
            title="Login"
            canClose={false}
            clickOutsideToDismiss={false}
          >
            <LoginModalContent canClose={false} runtime={IN_ELECTRON ? "app" : "browser"} />
          </DeclarativeModal>
        </RootPortal>
      )}

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

      if (currentY < 30) return

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
      className="absolute inset-x-0 flex h-10 justify-center will-change-transform bottom-safe-offset-8"
      transition={{ type: "spring" }}
      animate={animateController}
    >
      <div className={styles["float-bar"]}>
        <Logo className="size-5 shrink-0" />
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
