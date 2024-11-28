import { Outlet } from "react-router"

import { KeepAliveProvider } from "~/components/common/KeepAlive"
import { useDailyTask } from "~/hooks/biz/useDailyTask"

import { NewUserGuide } from "./index.shared"

export const MobileRootLayout = () => {
  useDailyTask()

  return (
    <>
      <Outlet />
      <NewUserGuide />
      <KeepAliveProvider />
    </>
  )
}
