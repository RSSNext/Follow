import { Outlet } from "react-router"

import { useDailyTask } from "~/hooks/biz/useDailyTask"

export const MobileRootLayout = () => {
  useDailyTask()
  return <Outlet />
}
