import { Outlet } from "react-router-dom"

import { Header } from "~/components/header"

export function Component() {
  return (
    <>
      <Header />
      <main className="flex h-full grow flex-col pt-[80px]">
        <Outlet />
      </main>
    </>
  )
}
