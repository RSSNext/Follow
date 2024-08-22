import { Header } from "@renderer/components/header"
import { Outlet } from "react-router-dom"

export function Component() {
  return (
    <>
      <Header />
      <main className="pt-[80px]">
        <Outlet />
      </main>
    </>
  )
}
