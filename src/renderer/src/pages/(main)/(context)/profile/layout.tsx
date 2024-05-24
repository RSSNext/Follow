import { Outlet } from "react-router-dom"

export function Component() {
  return (
    <Outlet
      context={{
        activeList: null,
        activeEntry: null,
        setActiveEntry: () => {},
        setActiveList: null,
      }}
    />
  )
}
