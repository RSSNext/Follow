import { RootPortal } from "@follow/components/ui/portal/index.js"
import { Outlet } from "react-router"

import { useLoginModalShow, useWhoami } from "~/atoms/user"
import { PlainModal } from "~/components/ui/modal/stacked/custom-modal"
import { DeclarativeModal } from "~/components/ui/modal/stacked/declarative-modal"
import { useDailyTask } from "~/hooks/biz/useDailyTask"
import { LoginModalContent } from "~/modules/auth/LoginModalContent"

import { NewUserGuide } from "./index.shared"

export const MobileRootLayout = () => {
  useDailyTask()
  const isAuthFail = useLoginModalShow()
  const user = useWhoami()
  return (
    <>
      <Outlet />
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
            <LoginModalContent canClose={false} runtime={"browser"} />
          </DeclarativeModal>
        </RootPortal>
      )}
    </>
  )
}
