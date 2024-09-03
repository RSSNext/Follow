import { EnvironmentIndicator } from "@renderer/modules/app/EnvironmentIndicator"
import { UserProvider } from "@renderer/providers/user-provider"
import { Outlet } from "react-router-dom"

export function Component() {
  return (
    <>
      <UserProvider />
      <Outlet />

      {!import.meta.env.PROD && <EnvironmentIndicator />}
    </>
  )
}
