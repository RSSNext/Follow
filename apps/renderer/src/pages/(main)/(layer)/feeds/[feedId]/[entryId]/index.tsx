import { useWheel } from "@use-gesture/react"
import { AnimatePresence, easeOut } from "framer-motion"
import { useRef } from "react"
import { useHotkeys } from "react-hotkeys-hook"
import { useParams } from "react-router-dom"

import { useUISettingKey } from "~/atoms/settings/ui"
import { useFeedColumnShow, useFeedColumnTempShow } from "~/atoms/sidebar"
import { m } from "~/components/common/Motion"
import { ActionButton } from "~/components/ui/button"
import { HotKeyScopeMap, ROUTE_ENTRY_PENDING, views } from "~/constants"
import { useNavigateEntry } from "~/hooks/biz/useNavigateEntry"
import { useRouteView } from "~/hooks/biz/useRouteParams"
import { cn } from "~/lib/utils"
import { EntryContent } from "~/modules/entry-content"
import { AppLayoutGridContainerProvider } from "~/providers/app-grid-layout-container-provider"

export const Component = () => {
  const { entryId } = useParams()
  const view = useRouteView()
  const navigate = useNavigateEntry()

  const settingWideMode = useUISettingKey("wideMode")
  const realEntryId = entryId === ROUTE_ENTRY_PENDING ? "" : entryId
  const inEntryContentWideMode = !(views[view].wideMode || (settingWideMode && !realEntryId))
  const wideMode = settingWideMode && realEntryId
  const feedColumnTempShow = useFeedColumnTempShow()
  const feedColumnShow = useFeedColumnShow()
  const shouldHeaderPaddingLeft = feedColumnTempShow && !feedColumnShow && settingWideMode

  useHotkeys(
    "Escape",
    () => {
      if (inEntryContentWideMode) {
        navigate({ entryId: null })
      }
    },
    {
      enabled: inEntryContentWideMode,
      scopes: HotKeyScopeMap.Home,
      preventDefault: true,
    },
  )
  const carouselRef = useRef<HTMLDivElement>(null)

  useWheel(
    ({ delta: [dex] }) => {
      if (dex < -50) {
        navigate({ entryId: null })
      }
    },
    {
      enabled: inEntryContentWideMode,
      target: carouselRef,
      eventOptions: { capture: true },
      axis: "x",
    },
  )

  return (
    <AnimatePresence>
      <AppLayoutGridContainerProvider>
        <AnimatePresence>
          {inEntryContentWideMode && (
            <m.div
              ref={carouselRef}
              // slide up
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100, transition: { duration: 0.2, ease: easeOut } }}
              transition={{ duration: 0.2, type: "spring" }}
              className={cn(
                "flex min-w-0 flex-1 flex-col",
                wideMode && "absolute inset-0 z-10 bg-theme-background",
              )}
            >
              {wideMode && (
                <ActionButton
                  className={cn(
                    "absolute left-3 top-3 z-10 duration-200",
                    shouldHeaderPaddingLeft
                      ? "left-[calc(theme(width.3)+theme(width.feed-col))]"
                      : "left-3",
                  )}
                  onClick={() => navigate({ entryId: null })}
                >
                  <i className="i-mgc-close-cute-re size-5" />
                </ActionButton>
              )}

              <EntryContent
                entryId={realEntryId}
                classNames={{
                  header: shouldHeaderPaddingLeft
                    ? "ml-[calc(theme(width.feed-col)+theme(width.8))]"
                    : "ml-8",
                }}
              />
            </m.div>
          )}
        </AnimatePresence>
      </AppLayoutGridContainerProvider>
    </AnimatePresence>
  )
}
