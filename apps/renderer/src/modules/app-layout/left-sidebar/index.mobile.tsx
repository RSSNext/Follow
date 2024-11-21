import { Outlet } from "react-router-dom"

import { ReloadPrompt } from "./index.shared"

export const LeftSidebarLayout = () => {
  return (
    <>
      <ReloadPrompt />
      <Outlet />
    </>
  )
}
