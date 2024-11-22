import { Outlet } from "react-router-dom"

import { useDailyTask } from "~/hooks/biz/useDailyTask"

export const MobileRootLayout = () => {
  useDailyTask()
  return <Outlet />
}
