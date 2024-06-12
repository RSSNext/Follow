import { SessionProvider } from "@hono/auth-js/react"
import { Outlet } from "react-router-dom"

export function Component() {
  return (
    <SessionProvider>
      <Outlet />
    </SessionProvider>
  )
}
