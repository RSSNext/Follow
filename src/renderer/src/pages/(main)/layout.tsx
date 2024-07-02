import {
  setMainContainerElement,
  useAuthFail,
  useUser,
} from "@renderer/atoms"
import { DeclarativeModal } from "@renderer/components/ui/modal/stacked/declarative-modal"
import { NoopChildren } from "@renderer/components/ui/modal/stacked/utils"
import { RootPortal } from "@renderer/components/ui/portal"
import { preventDefault } from "@renderer/lib/dom"
import { LoginModalContent } from "@renderer/modules/auth/LoginModalContent"
import { FeedColumn } from "@renderer/modules/feed-column"
import { Outlet } from "react-router-dom"

export function Component() {
  const isAuthFail = useAuthFail()
  const user = useUser()

  return (
    <div className="flex h-full" onContextMenu={preventDefault}>
      <div className="w-64 shrink-0 border-r">
        <FeedColumn />
      </div>
      {/* NOTE: tabIndex for main element can get by `document.activeElement` */}
      <main
        ref={setMainContainerElement}
        className="flex min-w-0 flex-1 bg-theme-background !outline-none"
        tabIndex={-1}
      >
        <Outlet />
      </main>
      {isAuthFail && !user && (
        <RootPortal>
          <DeclarativeModal
            CustomModalComponent={NoopChildren}
            open
            title="Login"
          >
            <LoginModalContent runtime={window.electron ? "app" : "browser"} />
          </DeclarativeModal>
        </RootPortal>
      )}
    </div>
  )
}
