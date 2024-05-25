import { Provider } from "jotai"
import { Outlet } from "react-router-dom"

import { useDark } from "./hooks/useDark"
import { jotaiStore } from "./lib/jotai"

function App() {
  useDark()
  return (
    <>
      <div
        className="drag-region absolute inset-x-0 top-0 h-10 shrink-0"
        aria-hidden
      />
      <Provider store={jotaiStore}>
        <Outlet />
      </Provider>
    </>
  )
}

export default App
