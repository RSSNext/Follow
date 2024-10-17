import { Header } from "@client/components/layout/header"
import { PoweredByFooter } from "@follow/components/common/PoweredByFooter.jsx"
import { Outlet } from "react-router-dom"

export const Component = () => {
  return (
    <div className="flex h-full flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <PoweredByFooter />
    </div>
  )
}
