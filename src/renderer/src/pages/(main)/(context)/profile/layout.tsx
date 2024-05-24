import { Outlet } from "react-router-dom"

export function Component() {
  return (
    <Outlet
      context={{
        activedList: null,
        activedEntry: null,
        setActivedEntry: () => {},
        setActivedList: null,
      }}
    />
  )
}
