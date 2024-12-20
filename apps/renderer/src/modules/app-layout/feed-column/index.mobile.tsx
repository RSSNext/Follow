import { RootPortal } from "@follow/components/ui/portal/index.js"
import { PresentSheet } from "@follow/components/ui/sheet/Sheet.js"
import { Outlet } from "react-router"

import { useLoginModalShow, useWhoami } from "~/atoms/user"
import { useDailyTask } from "~/hooks/biz/useDailyTask"
import { LoginModalContent } from "~/modules/auth/LoginModalContent"
import { UpdateNotice } from "~/modules/update-notice/UpdateNotice.mobile"

import { NewUserGuide } from "./index.shared"

export const MobileRootLayout = () => {
  useDailyTask()
  const isAuthFail = useLoginModalShow()
  const user = useWhoami()
  return (
    <>
      <Outlet />
      <NewUserGuide />

      <UpdateNotice />

      {isAuthFail && !user && (
        <RootPortal>
          <PresentSheet
            open
            contentClassName="overflow-visible pb-safe"
            title="Login"
            hideHeader
            content={<LoginModalContent canClose={false} runtime={"browser"} />}
          />
        </RootPortal>
      )}
    </>
  )
}
