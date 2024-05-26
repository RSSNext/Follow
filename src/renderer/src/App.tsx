import { Outlet } from "react-router-dom"

function App() {
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
