import { Outlet } from "react-router-dom"

import { useDark } from "./hooks/useDark"

function App() {
  useDark()
  return (
    <>
      <div
        className="drag-region absolute inset-x-0 top-0 h-10 shrink-0"
        aria-hidden
      />

      <Outlet />
    </>
  )
}

export default App
