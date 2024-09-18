import { Outlet } from "react-router-dom"

import { Header } from "~/components/header"

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
