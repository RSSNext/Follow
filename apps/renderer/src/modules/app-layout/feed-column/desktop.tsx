import type { DragEndEvent } from "@dnd-kit/core"
import { DndContext, PointerSensor, pointerWithin, useSensor, useSensors } from "@dnd-kit/core"
import { PanelSplitter } from "@follow/components/ui/divider/index.js"
import { Kbd } from "@follow/components/ui/kbd/Kbd.js"
import { RootPortal } from "@follow/components/ui/portal/index.jsx"
import type { FeedViewType } from "@follow/constants"
import { IN_ELECTRON } from "@follow/shared/constants"
import { preventDefault } from "@follow/utils/dom"
import { cn } from "@follow/utils/utils"
import { Slot } from "@radix-ui/react-slot"
import { throttle } from "es-toolkit/compat"
import type { PropsWithChildren } from "react"
import * as React from "react"
import { forwardRef, Suspense, useEffect, useRef, useState } from "react"
import { useHotkeys } from "react-hotkeys-hook"
import { Trans } from "react-i18next"
import { useResizable } from "react-resizable-layout"
import { Outlet } from "react-router"

import { setMainContainerElement, setRootContainerElement } from "~/atoms/dom"
import { getIsZenMode, getUISettings, setUISetting, useUISettingKey } from "~/atoms/settings/ui"
import {
  getFeedColumnTempShow,
  setFeedColumnShow,
  setFeedColumnTempShow,
  useFeedColumnShow,
  useFeedColumnTempShow,
} from "~/atoms/sidebar"
import { useLoginModalShow, useWhoami } from "~/atoms/user"
import { AppErrorBoundary } from "~/components/common/AppErrorBoundary"
import { ErrorComponentType } from "~/components/errors/enum"
import { PlainModal } from "~/components/ui/modal/stacked/custom-modal"
import { DeclarativeModal } from "~/components/ui/modal/stacked/declarative-modal"
import { HotKeyScopeMap, isDev } from "~/constants"
import { shortcuts } from "~/constants/shortcuts"
import { useDailyTask } from "~/hooks/biz/useDailyTask"
import { useBatchUpdateSubscription } from "~/hooks/biz/useSubscriptionActions"
import { useI18n } from "~/hooks/common"
import { EnvironmentIndicator } from "~/modules/app/EnvironmentIndicator"
import { NetworkStatusIndicator } from "~/modules/app/NetworkStatusIndicator"
import { LoginModalContent } from "~/modules/auth/LoginModalContent"
import { DebugRegistry } from "~/modules/debug/registry"
import { FeedColumn } from "~/modules/feed-column"
import { getSelectedFeedIds, resetSelectedFeedIds } from "~/modules/feed-column/atom"
import { AutoUpdater } from "~/modules/feed-column/auto-updater"
import { useShortcutsModal } from "~/modules/modal/shortcuts"
import { CmdF } from "~/modules/panel/cmdf"
import { SearchCmdK } from "~/modules/panel/cmdk"
import { CmdNTrigger } from "~/modules/panel/cmdn"
import { CornerPlayer } from "~/modules/player/corner-player"
import { AppNotificationContainer } from "~/modules/upgrade/lazy/index"
import { AppLayoutGridContainerProvider } from "~/providers/app-grid-layout-container-provider"

import { FooterInfo } from "./components/FooterInfo"
import { NewUserGuide } from "./index.shared"

const errorTypes = [
  ErrorComponentType.Page,
  ErrorComponentType.FeedFoundCanBeFollow,
  ErrorComponentType.FeedNotFound,
] as ErrorComponentType[]

export function MainDestopLayout() {
  const isAuthFail = useLoginModalShow()
  const user = useWhoami()

  const containerRef = useRef<HTMLDivElement>(null)

  useDailyTask()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  )
  const { mutate } = useBatchUpdateSubscription()
  const handleDragEnd = React.useCallback(
    (event: DragEndEvent) => {
      if (!event.over) {
        return
      }

      const { category, view } = event.over.data.current as {
        category?: string | null
        view: FeedViewType
      }

      mutate({ category, view, feedIdList: getSelectedFeedIds() })

      resetSelectedFeedIds()
    },
    [mutate],
  )

  return (
    <RootContainer ref={containerRef}>
      {!import.meta.env.PROD && <EnvironmentIndicator />}

      <Suspense>
        <AppNotificationContainer />
      </Suspense>
      <AppLayoutGridContainerProvider>
        <FeedResponsiveResizerContainer containerRef={containerRef}>
          <DndContext
            autoScroll={{ threshold: { x: 0, y: 0.2 } }}
            sensors={sensors}
            collisionDetection={pointerWithin}
            onDragEnd={handleDragEnd}
          >
            <FeedColumn>
              <CornerPlayer />
              <FooterInfo />

              {ELECTRON && <AutoUpdater />}

              <NetworkStatusIndicator />
            </FeedColumn>
          </DndContext>
        </FeedResponsiveResizerContainer>
      </AppLayoutGridContainerProvider>

      <main
        ref={setMainContainerElement}
        className="flex min-w-0 flex-1 bg-theme-background pt-[calc(var(--fo-window-padding-top)_-10px)] !outline-none"
        // NOTE: tabIndex for main element can get by `document.activeElement`
        tabIndex={-1}
      >
        <AppErrorBoundary errorType={errorTypes}>
          <Outlet />
        </AppErrorBoundary>
      </main>

      <NewUserGuide />

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

      <SearchCmdK />
      <CmdNTrigger />
      {ELECTRON && <CmdF />}
    </RootContainer>
  )
}

const RootContainer = forwardRef<HTMLDivElement, PropsWithChildren>(({ children }, ref) => {
  const feedColWidth = useUISettingKey("feedColWidth")

  const [elementRef, _setElementRef] = useState<HTMLDivElement | null>(null)
  const setElementRef = React.useCallback((el: HTMLDivElement | null) => {
    _setElementRef(el)
    setRootContainerElement(el)
  }, [])
  React.useImperativeHandle(ref, () => elementRef!)
  return (
    <div
      ref={setElementRef}
      style={
        {
          "--fo-feed-col-w": `${feedColWidth}px`,
        } as any
      }
      className="relative z-0 flex h-screen overflow-hidden print:h-auto print:overflow-auto"
      onContextMenu={preventDefault}
    >
      {children}
    </div>
  )
})

const FeedResponsiveResizerContainer = ({
  containerRef,
  children,
}: {
  containerRef: React.RefObject<HTMLDivElement>
} & PropsWithChildren) => {
  const { isDragging, position, separatorProps, separatorCursor } = useResizable({
    axis: "x",
    min: 256,
    max: 300,
    initial: getUISettings().feedColWidth,
    containerRef,

    onResizeEnd({ position }) {
      setUISetting("feedColWidth", position)
    },
  })

  const feedColumnShow = useFeedColumnShow()
  const feedColumnTempShow = useFeedColumnTempShow()

  useEffect(() => {
    if (feedColumnShow) {
      setFeedColumnTempShow(false)
      return
    }
    const handler = throttle((e: MouseEvent) => {
      const mouseX = e.clientX
      const mouseY = e.clientY

      const uiSettings = getUISettings()
      const feedColumnTempShow = getFeedColumnTempShow()
      const isInEntryContentWideMode = uiSettings.wideMode || getIsZenMode()
      if (mouseY < 200 && isInEntryContentWideMode) return
      const threshold = feedColumnTempShow ? uiSettings.feedColWidth : 100

      if (mouseX < threshold) {
        setFeedColumnTempShow(true)
      } else {
        setFeedColumnTempShow(false)
      }
    }, 300)

    document.addEventListener("mousemove", handler)
    return () => {
      document.removeEventListener("mousemove", handler)
    }
  }, [feedColumnShow])

  useHotkeys(
    shortcuts.layout.toggleSidebar.key,
    () => {
      setFeedColumnShow(!feedColumnShow)
    },
    {
      scopes: HotKeyScopeMap.Home,
    },
  )
  const showShortcuts = useShortcutsModal()
  useHotkeys(shortcuts.layout.showShortcuts.key, showShortcuts)

  const [delayShowSplitter, setDelayShowSplitter] = useState(feedColumnShow)

  useEffect(() => {
    let timer: any
    if (feedColumnShow) {
      timer = setTimeout(() => {
        setDelayShowSplitter(true)
      }, 200)
    } else {
      setDelayShowSplitter(false)
    }

    return () => {
      timer = clearTimeout(timer)
    }
  }, [feedColumnShow])
  const t = useI18n()

  return (
    <>
      <div
        data-hide-in-print
        className={cn(
          "shrink-0 overflow-hidden",
          "absolute inset-y-0 z-[2]",
          feedColumnTempShow && !feedColumnShow && "shadow-drawer-to-right z-[12]",
          !feedColumnShow && !feedColumnTempShow ? "-translate-x-full delay-200" : "",
          !isDragging ? "duration-200" : "",
        )}
        style={{
          width: `${position}px`,
          // @ts-expect-error
          "--fo-feed-col-w": `${position}px`,
        }}
      >
        <Slot className={!feedColumnShow ? "!bg-native" : ""}>{children}</Slot>
      </div>

      <div
        data-hide-in-print
        className={!isDragging ? "duration-200" : ""}
        style={{
          width: feedColumnShow ? `${position}px` : 0,
        }}
      />

      {delayShowSplitter && (
        <PanelSplitter
          isDragging={isDragging}
          cursor={separatorCursor}
          {...separatorProps}
          onDoubleClick={() => {
            setFeedColumnShow(false)
          }}
          tooltip={
            !isDragging && (
              <>
                <div>
                  {/* <b>Drag</b> to resize */}
                  <Trans t={t} i18nKey="resize.tooltip.drag_to_resize" components={{ b: <b /> }} />
                </div>
                <div className="center">
                  <span>
                    <Trans
                      t={t}
                      i18nKey="resize.tooltip.double_click_to_collapse"
                      components={{ b: <b /> }}
                    />
                  </span>{" "}
                  <Kbd className="ml-1">{"["}</Kbd>
                </div>
              </>
            )
          }
        />
      )}
    </>
  )
}

if (isDev) {
  DebugRegistry.add("New User Guide", () => {
    import("~/modules/new-user-guide/guide-modal-content").then((m) => {
      window.presentModal({
        title: "New User Guide",
        content: ({ dismiss }) => (
          <m.GuideModalContent
            onClose={() => {
              dismiss()
            }}
          />
        ),

        CustomModalComponent: PlainModal,
        modalContainerClassName: "flex items-center justify-center",

        canClose: false,
        clickOutsideToDismiss: false,
        overlay: true,
      })
    })
  })
}
