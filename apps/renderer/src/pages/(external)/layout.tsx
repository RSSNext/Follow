import { Outlet } from "react-router-dom"

import { EnvironmentIndicator } from "~/modules/app/EnvironmentIndicator"
import { UserProvider } from "~/providers/user-provider"

export function Component() {
  return (
    <>
      <UserProvider />
      <Outlet />

      {!import.meta.env.PROD && <EnvironmentIndicator />}
    </>
  )
}
