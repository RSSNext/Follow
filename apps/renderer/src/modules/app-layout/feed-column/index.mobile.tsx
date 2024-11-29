import { Outlet } from "react-router"

import { useDailyTask } from "~/hooks/biz/useDailyTask"

import { NewUserGuide } from "./index.shared"

export const MobileRootLayout = () => {
  useDailyTask()

  return (
    <>
      <Outlet />
      <NewUserGuide />
    </>
  )
}
