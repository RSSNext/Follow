import { Header } from "@renderer/components/header"
import { Outlet } from "react-router-dom"

export function Component() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}
