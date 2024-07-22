import { setAppSearchOpen } from "@renderer/atoms/app"
import { getReadonlyRoute } from "@renderer/atoms/route"
import { useGeneralSettingKey } from "@renderer/atoms/settings/general"
import { useSidebarActiveView } from "@renderer/atoms/sidebar"
import { Logo } from "@renderer/components/icons/logo"
import { ActionButton } from "@renderer/components/ui/button"
import { ProfileButton } from "@renderer/components/user-button"
import { views } from "@renderer/constants"
import { useNavigateEntry } from "@renderer/hooks/biz/useNavigateEntry"
import { useReduceMotion } from "@renderer/hooks/biz/useReduceMotion"
import { getRouteParams } from "@renderer/hooks/biz/useRouteParams"
import { useAuthQuery } from "@renderer/hooks/common"
import { stopPropagation } from "@renderer/lib/dom"
import { Routes } from "@renderer/lib/enum"
import { jotaiStore } from "@renderer/lib/jotai"
import { shortcuts } from "@renderer/lib/shortcuts"
import { clamp, cn } from "@renderer/lib/utils"
import { Queries } from "@renderer/queries"
import { useSubscriptionStore } from "@renderer/store/subscription"
import { useFeedUnreadStore } from "@renderer/store/unread"
import { useWheel } from "@use-gesture/react"
import type { MotionValue } from "framer-motion"
import { m, useSpring } from "framer-motion"
import { atom, useAtomValue } from "jotai"
import { Lethargy } from "lethargy"
import type { PropsWithChildren } from "react"
import { useCallback, useLayoutEffect, useRef } from "react"
import { isHotkeyPressed, useHotkeys } from "react-hotkeys-hook"
import { Link } from "react-router-dom"

import { Vibrancy } from "../../components/ui/background"
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

const useUnreadByView = () => {
  useAuthQuery(Queries.subscription.byView())
  const idByView = useSubscriptionStore((state) => state.dataIdByView)
  const totalUnread = useFeedUnreadStore((state) => {
    const unread = {} as Record<number, number>

    for (const view in idByView) {
      unread[view] = idByView[view].reduce(
        (acc, feedId) => acc + (state.data[feedId] || 0),
        0,
      )
    }
    return unread
  })

  return totalUnread
}

const carouselWidthAtom = atom(256)
export function FeedColumn({ children }: PropsWithChildren) {
  const carouselRef = useRef<HTMLDivElement>(null)

  const [active, setActive_] = useSidebarActiveView()
  const spring = useSpring(0, {
    stiffness: 700,
    damping: 40,
  })
  const navigateBackHome = useBackHome(active)
  const setActive: typeof setActive_ = useCallback(
    (args) => {
      const nextActive = typeof args === "function" ? args(active) : args
      setActive_(args)

      if (getReadonlyRoute().location.pathname.startsWith(Routes.Feeds)) {
        navigateBackHome(nextActive)
      }
    },
    [active, navigateBackHome, spring],
  )

  useLayoutEffect(() => {
    const { view } = getRouteParams()
    if (view !== undefined) {
      setActive_(view)
    }
  }, [setActive_])

  useLayoutEffect(() => {
    spring.set(-active * jotaiStore.get(carouselWidthAtom))
  }, [active, spring])

  useHotkeys(
    shortcuts.feeds.switchBetweenViews.key,
    (e) => {
      e.preventDefault()
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
    { scopes: ["home"] },
  )

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

  useLayoutEffect(() => {
    const $carousel = carouselRef.current
    if (!$carousel) return

    const handler = () => {
      const width = $carousel.clientWidth
      jotaiStore.set(carouselWidthAtom, width)
    }
    handler()
    new ResizeObserver(handler).observe($carousel)
    return () => {
      new ResizeObserver(handler).disconnect()
    }
  }, [])

  const normalStyle =
    !window.electron || window.electron.process.platform !== "darwin"

  const unreadByView = useUnreadByView()

  return (
    <Vibrancy
      className="relative flex h-full flex-col gap-3 pt-2.5"
      onClick={useCallback(() => navigateBackHome(), [navigateBackHome])}
    >
      <div
        className={cn(
          "ml-5 mr-3 flex items-center",

          normalStyle ? "ml-4 justify-between" : "justify-end",
        )}
      >
        {normalStyle && (
          <div
            className="relative flex items-center gap-1 text-xl font-bold"
            onClick={(e) => {
              e.stopPropagation()
              navigateBackHome()
            }}
          >
            <Logo className="mr-1 size-6" />
            {APP_NAME}
          </div>
        )}
        <div
          className="relative flex items-center gap-1"
          onClick={stopPropagation}
        >
          <SearchActionButton />

          <Link to="/discover" tabIndex={-1}>
            <ActionButton shortcut="Meta+T" tooltip="Add">
              <i className="i-mgc-add-cute-re size-5 text-theme-vibrancyFg" />
            </ActionButton>
          </Link>
          <ProfileButton method="modal" />
        </div>
      </div>

      <div
        className="flex w-full justify-between px-3 text-xl text-theme-vibrancyFg"
        onClick={stopPropagation}
      >
        {views.map((item, index) => (
          <ActionButton
            key={item.name}
            tooltip={`${item.name}`}
            shortcut={`${index + 1}`}
            className={cn(
              active === index && item.className,
              "flex h-11 flex-col items-center gap-1 text-xl",
              "hover:!bg-theme-vibrancyBg",
            )}
            onClick={(e) => {
              setActive(index)
              e.stopPropagation()
            }}
          >
            {item.icon}
            <div className="text-[0.625rem] font-medium leading-none">
              {unreadByView[index] > 99 ? (
                <span className="-mr-0.5">99+</span>
              ) : (
                unreadByView[index]
              )}
            </div>
          </ActionButton>
        ))}
      </div>
      <div className="size-full overflow-hidden" ref={carouselRef}>
        <SwipeWrapper active={active} spring={spring}>
          {views.map((item, index) => (
            <section
              key={item.name}
              className="h-full w-[var(--fo-feed-col-w)] shrink-0 snap-center pb-8"
            >
              {active === index && (
                <FeedList
                  className="flex size-full flex-col text-sm"
                  view={index}
                />
              )}
            </section>
          ))}
        </SwipeWrapper>
      </div>

      {children}
    </Vibrancy>
  )
}

const SwipeWrapper: Component<{
  active: number
  spring: MotionValue<number>
}> = ({ children, active, spring }) => {
  const reduceMotion = useReduceMotion()

  const carouselWidth = useAtomValue(carouselWidthAtom)
  if (reduceMotion) {
    return (
      <div
        className="flex h-full"
        style={{
          transform: `translateX(${-active * carouselWidth}px)`,
        }}
      >
        {children}
      </div>
    )
  }
  return (
    <m.div
      className="flex h-full"
      style={{
        x: spring,
      }}
    >
      {children}
    </m.div>
  )
}

const SearchActionButton = () => {
  const canSearch = useGeneralSettingKey("dataPersist")
  if (!canSearch) return null
  return (
    <ActionButton
      shortcut="Meta+K"
      tooltip="Search"
      onClick={() => setAppSearchOpen(true)}
    >
      <i className="i-mgc-search-2-cute-re size-5 text-theme-vibrancyFg" />
    </ActionButton>
  )
}
