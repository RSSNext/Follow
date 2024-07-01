import { getReadonlyRoute } from "@renderer/atoms"
import { useSidebarActiveView } from "@renderer/atoms/sidebar"
import { Logo } from "@renderer/components/icons/logo"
import { ActionButton } from "@renderer/components/ui/button"
import { ProfileButton } from "@renderer/components/user-button"
import { useNavigateEntry } from "@renderer/hooks/biz/useNavigateEntry"
import { useReduceMotion } from "@renderer/hooks/biz/useReduceMotion"
import { APP_NAME, levels, views } from "@renderer/lib/constants"
import { stopPropagation } from "@renderer/lib/dom"
import { Routes } from "@renderer/lib/enum"
import { shortcuts } from "@renderer/lib/shortcuts"
import { clamp, cn } from "@renderer/lib/utils"
import { useWheel } from "@use-gesture/react"
import { m, useSpring } from "framer-motion"
import { Lethargy } from "lethargy"
import { useCallback, useRef } from "react"
import { isHotkeyPressed, useHotkeys } from "react-hotkeys-hook"
import { Link } from "react-router-dom"

import { Vibrancy } from "../../components/ui/background"
import { FeedList } from "./list"

const lethargy = new Lethargy()

const useBackHome = (active: number) => {
  const navigate = useNavigateEntry()

  return useCallback((overvideActive?: number) => {
    navigate({
      feedId: null,
      entryId: null,
      view: overvideActive ?? active,
      level: levels.view,
    })
  }, [active, navigate])
}
export function FeedColumn() {
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
      spring.set(-nextActive * 256)
    },
    [active, navigateBackHome, spring],
  )

  useHotkeys(
    shortcuts.feeds.switchBetweenViews.key,
    () => {
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

  const normalStyle =
    !window.electron || window.electron.process.platform !== "darwin"

  const reduceMotion = useReduceMotion()
  return (
    <Vibrancy
      className="flex h-full flex-col gap-3 pt-2.5"
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
            className="flex items-center gap-1 text-xl font-bold"
            onClick={(e) => {
              e.stopPropagation()

              navigateBackHome()
            }}
          >
            <Logo className="mr-1 size-6" />
            {APP_NAME}
          </div>
        )}
        <div className="flex items-center gap-2" onClick={stopPropagation}>
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
              "flex items-center text-xl",
              "hover:!bg-theme-vibrancyBg",
              "focus-visible:!outline-none",
            )}
            onClick={(e) => {
              setActive(index)
              e.stopPropagation()
            }}
          >
            {item.icon}
          </ActionButton>
        ))}
      </div>
      <div className="size-full overflow-hidden" ref={carouselRef}>
        <m.div className="flex h-full" style={{ x: reduceMotion ? -active * 256 : spring }}>
          {views.map((item, index) => (
            <section
              key={item.name}
              className="min-h-full w-64 shrink-0 snap-center overflow-y-auto"
            >
              {active === index && (
                <FeedList
                  className="flex size-full flex-col px-3 pb-6 text-sm"
                  view={index}
                />
              )}
            </section>
          ))}
        </m.div>
      </div>
    </Vibrancy>
  )
}
