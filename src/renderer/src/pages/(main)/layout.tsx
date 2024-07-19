import { setMainContainerElement } from "@renderer/atoms/dom"
import { useLoginModalShow, useMe } from "@renderer/atoms/user"
import { DeclarativeModal } from "@renderer/components/ui/modal/stacked/declarative-modal"
import { NoopChildren } from "@renderer/components/ui/modal/stacked/utils"
import { RootPortal } from "@renderer/components/ui/portal"
import { preventDefault } from "@renderer/lib/dom"
import { EnvironmentIndicator } from "@renderer/modules/app/EnvironmentIndicator"
import { NetworkStatusIndicator } from "@renderer/modules/app/NetworkStatusIndicator"
import { LoginModalContent } from "@renderer/modules/auth/LoginModalContent"
import { FeedColumn } from "@renderer/modules/feed-column"
import { AutoUpdater } from "@renderer/modules/feed-column/auto-updater"
import { SearchCmdK } from "@renderer/modules/search/cmdk"
import { Outlet } from "react-router-dom"

export function Component() {
  const isAuthFail = useLoginModalShow()
  const user = useMe()

  return (
    <div className="flex h-full" onContextMenu={preventDefault}>
      <div className="w-64 shrink-0 border-r">
        <FeedColumn>
          {APP_VERSION?.[0] === "0" && (
            <div className="pointer-events-none absolute bottom-3 w-full text-center text-xs opacity-20">
              Early Access
              {" "}
              {GIT_COMMIT_SHA ?
                `(${GIT_COMMIT_SHA.slice(0, 7).toUpperCase()})` :
                ""}
            </div>
          )}
          <AutoUpdater />

          <NetworkStatusIndicator />
          {!import.meta.env.PROD && <EnvironmentIndicator />}
        </FeedColumn>
      </div>
      {/* NOTE: tabIndex for main element can get by `document.activeElement` */}
      <main
        ref={setMainContainerElement}
        className="flex min-w-0 flex-1 bg-theme-background !outline-none"
        tabIndex={-1}
      >
        <Outlet />
      </main>

      <SearchCmdK />
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
              runtime={ELECTRON ? "app" : "browser"}
            />
          </DeclarativeModal>
        </RootPortal>
      )}
    </div>
  )
}
