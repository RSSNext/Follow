import { queryClient } from "@renderer/lib/query-client"
import { useEffect } from "react"
import { Outlet } from "react-router-dom"

import { handlers } from "./tipc"

function App() {
  useEffect(() => {
    const cleanup = handlers?.invalidateQuery.listen((queryKey) => {
      queryClient.invalidateQueries({
        queryKey,
      })
    })

    return cleanup
  }, [])

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
