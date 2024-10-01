import { repository } from "@pkg"
import { Slot } from "@radix-ui/react-slot"
import { throttle } from "lodash-es"
import type { PropsWithChildren } from "react"
import React, { useEffect, useRef, useState } from "react"
import { useHotkeys } from "react-hotkeys-hook"
import { Trans, useTranslation } from "react-i18next"
import { useResizable } from "react-resizable-layout"
import { Outlet } from "react-router-dom"

import { setMainContainerElement } from "~/atoms/dom"
import { useViewport } from "~/atoms/hooks/viewport"
import { getUISettings, setUISetting } from "~/atoms/settings/ui"
import { setFeedColumnShow, useFeedColumnShow } from "~/atoms/sidebar"
import { useLoginModalShow, useWhoami } from "~/atoms/user"
import { AppErrorBoundary } from "~/components/common/AppErrorBoundary"
import { ErrorComponentType } from "~/components/errors/enum"
import { PanelSplitter } from "~/components/ui/divider"
import { Kbd } from "~/components/ui/kbd/Kbd"
import { PlainModal } from "~/components/ui/modal/stacked/custom-modal"
import { DeclarativeModal } from "~/components/ui/modal/stacked/declarative-modal"
import { RootPortal } from "~/components/ui/portal"
import { HotKeyScopeMap } from "~/constants"
import { shortcuts } from "~/constants/shortcuts"
import { useDailyTask } from "~/hooks/biz/useDailyTask"
import { useI18n } from "~/hooks/common"
import { preventDefault } from "~/lib/dom"
import { cn } from "~/lib/utils"
import { EnvironmentIndicator } from "~/modules/app/EnvironmentIndicator"
import { NetworkStatusIndicator } from "~/modules/app/NetworkStatusIndicator"
import { LoginModalContent } from "~/modules/auth/LoginModalContent"
import { FeedColumn } from "~/modules/feed-column"
import { AutoUpdater } from "~/modules/feed-column/auto-updater"
import { CornerPlayer } from "~/modules/feed-column/corner-player"
import { useShortcutsModal } from "~/modules/modal/shortcuts"
import { CmdF } from "~/modules/panel/cmdf"
import { SearchCmdK } from "~/modules/panel/cmdk"
import { CmdNTrigger } from "~/modules/panel/cmdn"
import { AppLayoutGridContainerProvider } from "~/providers/app-grid-layout-container-provider"

const FooterInfo = () => {
  const { t } = useTranslation()
  return (
    <div className="relative">
      {APP_VERSION?.[0] === "0" && (
        <div className="pointer-events-none !mt-0 w-full py-3 text-center text-xs opacity-20">
          {t("early_access")}{" "}
          {GIT_COMMIT_SHA ? `(${GIT_COMMIT_SHA.slice(0, 7).toUpperCase()})` : ""}
        </div>
      )}

      {!ELECTRON && (
        <div className="center absolute inset-y-0 right-2">
          <button
            type="button"
            aria-label="Download Desktop App"
            onClick={() => {
              window.open(`${repository.url}/releases`)
            }}
            className="center rounded-full border bg-background p-1.5 shadow-sm"
          >
            <i className="i-mgc-download-2-cute-re size-3.5 opacity-80" />
          </button>
        </div>
      )}
    </div>
  )
}

const errorTypes = [
  ErrorComponentType.Page,
  ErrorComponentType.FeedFoundCanBeFollow,
  ErrorComponentType.FeedNotFound,
] as ErrorComponentType[]
export function Component() {
  const isAuthFail = useLoginModalShow()
  const user = useWhoami()

  const containerRef = useRef<HTMLDivElement>(null)

  useDailyTask()

  const isNotSupportWidth = useViewport((v) => v.w < 1024 && v.w !== 0) && !window.electron

  if (isNotSupportWidth) {
    return (
      <div className="center fixed inset-0 flex-col text-balance px-4 text-center">
        <i className="i-mingcute-device-line mb-2 size-16 text-muted-foreground" />
        <div>{APP_NAME} is not yet supported on mobile devices.</div>
        <div>
          Your device width is <b>{`${window.innerWidth}`}px</b>, which is less than the minimum
          supported width 1024px.
        </div>
        <div>Please switch to the desktop app to continue using {APP_NAME}</div>

        <div>
          Download:{" "}
          <a className="follow-link--underline" href={repository.url}>
            {repository.url}
          </a>
        </div>
      </div>
    )
  }

  return (
    <div
      className="flex h-screen overflow-hidden"
      ref={containerRef}
      onContextMenu={preventDefault}
    >
      {!import.meta.env.PROD && <EnvironmentIndicator />}

      <AppLayoutGridContainerProvider>
        <FeedResponsiveResizerContainer containerRef={containerRef}>
          <FeedColumn>
            <CornerPlayer />
            <FooterInfo />

            {ELECTRON && <AutoUpdater />}

            <NetworkStatusIndicator />
          </FeedColumn>
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

      <SearchCmdK />
      <CmdNTrigger />
      {ELECTRON && <CmdF />}

      {isAuthFail && !user && (
        <RootPortal>
          <DeclarativeModal
            id="login"
            CustomModalComponent={PlainModal}
            open
            title="Login"
            canClose={false}
            clickOutsideToDismiss={false}
          >
            <LoginModalContent canClose={false} runtime={window.electron ? "app" : "browser"} />
          </DeclarativeModal>
        </RootPortal>
      )}
    </div>
  )
}

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
  const [feedColumnTempShow, setFeedColumnTempShow] = useState(false)

  useEffect(() => {
    const handler = throttle((e: MouseEvent) => {
      const mouseX = e.clientX
      const threshold = feedColumnTempShow ? getUISettings().feedColWidth : 100

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
  }, [feedColumnTempShow])

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
  useHotkeys(shortcuts.layout.showShortcuts.key, showShortcuts, {
    scopes: HotKeyScopeMap.Home,
  })

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
        className={cn(
          "shrink-0 overflow-hidden",
          "absolute inset-y-0 z-[2]",
          feedColumnTempShow && !feedColumnShow && "shadow-drawer-to-right z-[12] border-r",
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
