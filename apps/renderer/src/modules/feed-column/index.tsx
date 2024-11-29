import { useDroppable } from "@dnd-kit/core"
import { ActionButton } from "@follow/components/ui/button/index.js"
import { RootPortal } from "@follow/components/ui/portal/index.js"
import { Routes, views } from "@follow/constants"
import { useTypeScriptHappyCallback } from "@follow/hooks"
import { useRegisterGlobalContext } from "@follow/shared/bridge"
import { stopPropagation } from "@follow/utils/dom"
import { clamp, cn } from "@follow/utils/utils"
import { useWheel } from "@use-gesture/react"
import { AnimatePresence, m } from "framer-motion"
import { Lethargy } from "lethargy"
import type { FC, PropsWithChildren } from "react"
import { startTransition, useCallback, useLayoutEffect, useRef, useState } from "react"
import { isHotkeyPressed, useHotkeys } from "react-hotkeys-hook"
import { useTranslation } from "react-i18next"

import { useRootContainerElement } from "~/atoms/dom"
import { useUISettingKey } from "~/atoms/settings/ui"
import { setFeedColumnShow, useFeedColumnShow, useSidebarActiveView } from "~/atoms/sidebar"
import { HotKeyScopeMap, isElectronBuild } from "~/constants"
import { shortcuts } from "~/constants/shortcuts"
import { useNavigateEntry } from "~/hooks/biz/useNavigateEntry"
import { useReduceMotion } from "~/hooks/biz/useReduceMotion"
import { getRouteParams } from "~/hooks/biz/useRouteParams"
import { useUnreadByView } from "~/store/unread/hooks"

import { WindowUnderBlur } from "../../components/ui/background"
import { getSelectedFeedIds, resetSelectedFeedIds, setSelectedFeedIds } from "./atom"
import { FeedColumnHeader } from "./header"
import { useShouldFreeUpSpace } from "./hook"
import { FeedList } from "./list"

const lethargy = new Lethargy()

const useBackHome = (active: number) => {
  const navigate = useNavigateEntry()

  return useCallback(
    (overvideActive?: number) => {
      navigate({
        feedId: null,
        entryId: null,
        view: overvideActive ?? active,
      })
    },
    [active, navigate],
  )
}

export function FeedColumn({ children, className }: PropsWithChildren<{ className?: string }>) {
  const carouselRef = useRef<HTMLDivElement>(null)

  const [active, setActive_] = useSidebarActiveView()

  const navigateBackHome = useBackHome(active)
  const setActive: typeof setActive_ = useCallback(
    (args) => {
      const nextActive = typeof args === "function" ? args(active) : args
      setActive_(args)

      navigateBackHome(nextActive)
      resetSelectedFeedIds()
    },
    [active, navigateBackHome, setActive_],
  )

  useLayoutEffect(() => {
    const { view } = getRouteParams()
    if (view !== undefined) {
      setActive_(view)
    }
  }, [setActive_])

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

  const [useHotkeysSwitch, setUseHotkeysSwitch] = useState<boolean>(false)
  useHotkeys(
    shortcuts.feeds.switchBetweenViews.key,
    (e) => {
      e.preventDefault()
      setUseHotkeysSwitch(true)
      if (isHotkeyPressed("Left")) {
        setActive((i) => {
          if (i === 0) {
            return views.length - 1
          } else {
            return i - 1
          }
        })
      } else {
        setActive((i) => (i + 1) % views.length)
      }
    },
    { scopes: HotKeyScopeMap.Home },
  )

  useRegisterGlobalContext("goToDiscover", () => {
    window.router.navigate(Routes.Discover)
  })

  const shouldFreeUpSpace = useShouldFreeUpSpace()
  const feedColumnShow = useFeedColumnShow()
  const rootContainerElement = useRootContainerElement()

  return (
    <WindowUnderBlur
      data-hide-in-print
      className={cn(
        "relative flex h-full flex-col space-y-3 pt-2.5",

        !feedColumnShow && isElectronBuild && "bg-zinc-200 dark:bg-neutral-800",
        className,
      )}
      onClick={useCallback(() => navigateBackHome(), [navigateBackHome])}
    >
      <FeedColumnHeader />
      {!feedColumnShow && (
        <RootPortal to={rootContainerElement}>
          <ActionButton
            tooltip={"Toggle Feed Column"}
            className="center absolute top-2.5 z-0 hidden -translate-x-2 text-zinc-500 left-macos-traffic-light macos:flex"
            onClick={() => setFeedColumnShow(true)}
          >
            <i className="i-mgc-layout-leftbar-open-cute-re" />
          </ActionButton>
        </RootPortal>
      )}

      <div
        className="flex w-full justify-between px-3 text-xl text-theme-vibrancyFg"
        onClick={stopPropagation}
      >
        {views.map((item, index) => (
          <ViewSwitchButton
            key={item.name}
            item={item}
            index={index}
            active={active}
            setActive={setActive}
            useHotkeysSwitch={useHotkeysSwitch}
            setUseHotkeysSwitch={setUseHotkeysSwitch}
          />
        ))}
      </div>
      <div
        className={cn("relative flex size-full", !shouldFreeUpSpace && "overflow-hidden")}
        ref={carouselRef}
        onPointerDown={useTypeScriptHappyCallback((e) => {
          if (!(e.target instanceof HTMLElement) || !e.target.closest("[data-feed-id]")) {
            const nextSelectedFeedIds = getSelectedFeedIds()
            if (nextSelectedFeedIds.length > 0) {
              setSelectedFeedIds(nextSelectedFeedIds)
            } else {
              resetSelectedFeedIds()
            }
          }
        }, [])}
      >
        <SwipeWrapper active={active}>
          {views.map((item, index) => (
            <section key={item.name} className="h-full w-feed-col shrink-0 snap-center">
              <FeedList className="flex size-full flex-col text-sm" view={index} />
            </section>
          ))}
        </SwipeWrapper>
      </div>

      {children}
    </WindowUnderBlur>
  )
}

const ViewSwitchButton: FC<{
  item: (typeof views)[number]
  index: number

  active: number
  setActive: (next: number | ((prev: number) => number)) => void

  useHotkeysSwitch: boolean
  setUseHotkeysSwitch: (next: boolean) => void
}> = ({ item, index, active, setActive, useHotkeysSwitch, setUseHotkeysSwitch }) => {
  const unreadByView = useUnreadByView()
  const { t } = useTranslation()
  const showSidebarUnreadCount = useUISettingKey("sidebarShowUnreadCount")

  const { isOver, setNodeRef } = useDroppable({
    id: `view-${item.name}`,
    data: {
      category: "",
      view: item.view,
    },
  })

  return (
    <ActionButton
      ref={setNodeRef}
      key={item.name}
      tooltip={t(item.name)}
      shortcut={`${index + 1}`}
      className={cn(
        active === index && item.className,
        "flex h-11 flex-col items-center gap-1 text-xl",
        ELECTRON ? "hover:!bg-theme-item-hover" : "",
        active === index && useHotkeysSwitch ? "bg-theme-item-active" : "",
        isOver && "border-theme-accent-400 bg-theme-accent-400/60",
      )}
      onClick={(e) => {
        startTransition(() => {
          setActive(index)
          setUseHotkeysSwitch(false)
        })
        e.stopPropagation()
      }}
    >
      {item.icon}
      {showSidebarUnreadCount ? (
        <div className="text-[0.625rem] font-medium leading-none">
          {unreadByView[index] > 99 ? <span className="-mr-0.5">99+</span> : unreadByView[index]}
        </div>
      ) : (
        <i
          className={cn(
            "i-mgc-round-cute-fi text-[0.25rem]",
            unreadByView[index] ? (active === index ? "opacity-100" : "opacity-60") : "opacity-0",
          )}
        />
      )}
    </ActionButton>
  )
}

const SwipeWrapper: FC<{
  active: number
  children: React.JSX.Element[]
}> = ({ children, active }) => {
  const reduceMotion = useReduceMotion()

  const feedColumnWidth = useUISettingKey("feedColWidth")
  const containerRef = useRef<HTMLDivElement>(null)

  const prevActiveIndexRef = useRef(-1)
  const [isReady, setIsReady] = useState(false)

  const [direction, setDirection] = useState<"left" | "right">("right")
  const [currentAnimtedActive, setCurrentAnimatedActive] = useState(active)

  useLayoutEffect(() => {
    const prevActiveIndex = prevActiveIndexRef.current
    if (prevActiveIndex !== active) {
      if (prevActiveIndex < active) {
        setDirection("right")
      } else {
        setDirection("left")
      }
    }
    // eslint-disable-next-line @eslint-react/web-api/no-leaked-timeout
    setTimeout(() => {
      setCurrentAnimatedActive(active)
    }, 0)
    if (prevActiveIndexRef.current !== -1) {
      setIsReady(true)
    }
    prevActiveIndexRef.current = active
  }, [active])

  if (reduceMotion) {
    return <div ref={containerRef}>{children[currentAnimtedActive]}</div>
  }

  return (
    <AnimatePresence mode="popLayout">
      <m.div
        className="grow"
        key={currentAnimtedActive}
        initial={
          isReady
            ? {
                x: direction === "right" ? feedColumnWidth : -feedColumnWidth,
              }
            : true
        }
        animate={{ x: 0 }}
        exit={{
          x: direction === "right" ? -feedColumnWidth : feedColumnWidth,
        }}
        transition={{
          x: { type: "spring", stiffness: 700, damping: 40 },
        }}
        ref={containerRef}
      >
        {children[currentAnimtedActive]}
      </m.div>
    </AnimatePresence>
  )
}
