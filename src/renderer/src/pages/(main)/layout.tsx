import { repository } from "@pkg"
import { setMainContainerElement } from "@renderer/atoms/dom"
import { getUISettings, setUISetting } from "@renderer/atoms/settings/ui"
import { setFeedColumnShow, useFeedColumnShow } from "@renderer/atoms/sidebar"
import { useLoginModalShow, useWhoami } from "@renderer/atoms/user"
import { AppErrorBoundary } from "@renderer/components/common/AppErrorBoundary"
import { ErrorComponentType } from "@renderer/components/errors"
import { PanelSplitter } from "@renderer/components/ui/divider"
import { DeclarativeModal } from "@renderer/components/ui/modal/stacked/declarative-modal"
import { NoopChildren } from "@renderer/components/ui/modal/stacked/utils"
import { RootPortal } from "@renderer/components/ui/portal"
import { shortcuts } from "@renderer/constants/shortcuts"
import { preventDefault } from "@renderer/lib/dom"
import { cn } from "@renderer/lib/utils"
import { EnvironmentIndicator } from "@renderer/modules/app/EnvironmentIndicator"
import { NetworkStatusIndicator } from "@renderer/modules/app/NetworkStatusIndicator"
import { LoginModalContent } from "@renderer/modules/auth/LoginModalContent"
import { FeedColumn } from "@renderer/modules/feed-column"
import { AutoUpdater } from "@renderer/modules/feed-column/auto-updater"
import { CornerPlayer } from "@renderer/modules/feed-column/corner-player"
import { CmdF } from "@renderer/modules/panel/cmdf"
import { SearchCmdK } from "@renderer/modules/panel/cmdk"
import { CmdNTrigger } from "@renderer/modules/panel/cmdn"
import { throttle } from "lodash-es"
import type { PropsWithChildren } from "react"
import { useEffect, useRef, useState } from "react"
import { useHotkeys } from "react-hotkeys-hook"
import { useResizable } from "react-resizable-layout"
import { Outlet } from "react-router-dom"

const FooterInfo = () => (
  <div className="relative">
    {APP_VERSION?.[0] === "0" && (
      <div className="pointer-events-none !mt-0 w-full py-3 text-center text-xs opacity-20">
        Early Access
        {" "}
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
          className="center cursor-pointer rounded-full border bg-background p-1.5 shadow-sm"
        >
          <i className="i-mgc-download-2-cute-re size-3.5 opacity-80" />
        </button>
      </div>
    )}
  </div>
)

const errorTypes = [
  ErrorComponentType.Page,
  ErrorComponentType.FeedFoundCanBeFollow,
  ErrorComponentType.FeedNotFound,
] as ErrorComponentType[]
export function Component() {
  const isAuthFail = useLoginModalShow()
  const user = useWhoami()

  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div
      className="flex h-screen overflow-hidden"
      ref={containerRef}
      onContextMenu={preventDefault}
    >
      <FeedResponsiveResizerContainer containerRef={containerRef}>
        <FeedColumn>
          <CornerPlayer />

          <FooterInfo />

          {ELECTRON && <AutoUpdater />}

          <NetworkStatusIndicator />
          {!import.meta.env.PROD && <EnvironmentIndicator />}
        </FeedColumn>
      </FeedResponsiveResizerContainer>
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
            CustomModalComponent={NoopChildren}
            open
            title="Login"
            canClose={false}
            clickOutsideToDismiss={false}
          >
            <LoginModalContent
              canClose={false}
              runtime={window.electron ? "app" : "browser"}
            />
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
  const { isDragging, position, separatorProps } = useResizable({
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
      const { feedColWidth } = getUISettings()

      if (mouseX < feedColWidth) {
        setFeedColumnTempShow(true)
      } else {
        setFeedColumnTempShow(false)
      }
    }, 300)

    document.addEventListener("mousemove", handler)
    return () => {
      document.removeEventListener("mousemove", handler)
    }
  }, [])

  useHotkeys(shortcuts.layout.toggleSidebar.key, () => {
    setFeedColumnShow(!feedColumnShow)
  })

  const [delayShowSplitter, setDelayShowSplitter] = useState(feedColumnShow)

  useEffect(() => {
    let timer: any
    if (feedColumnShow) {
      // eslint-disable-next-line @eslint-react/web-api/no-leaked-timeout
      timer = setTimeout(() => {
        setDelayShowSplitter(true)
      }, 200)
    } else {
      // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
      setDelayShowSplitter(false)
    }

    return () => {
      timer = clearTimeout(timer)
    }
  }, [feedColumnShow])

  return (
    <>
      <div
        className={cn(
          "shrink-0 overflow-hidden",
          "absolute inset-y-0 z-10 duration-200",
          feedColumnTempShow &&
          !feedColumnShow &&
          "shadow-drawer-right z-[12] border-r",
          !feedColumnShow && !feedColumnTempShow ?
            "-translate-x-full delay-200" :
            "",
        )}
        style={{
          "width": `${position}px`,
          // @ts-expect-error
          "--fo-feed-col-w": `${position}px`,
        }}
      >
        {children}
      </div>

      <div
        className={!isDragging ? "duration-200" : ""}
        style={{
          width: feedColumnShow ? `${position}px` : 0,
        }}
      />

      {delayShowSplitter && <PanelSplitter {...separatorProps} />}
    </>
  )
}
