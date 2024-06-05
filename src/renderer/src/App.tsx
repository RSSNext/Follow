import { queryClient } from "@renderer/lib/query-client"
import { useEffect } from "react"
import { Outlet } from "react-router-dom"

import { useDark } from "./hooks/useDark"
import { handlers } from "./tipc"

function App() {
  useDark()
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
      {window.electron && (
        <div
          className="drag-region absolute inset-x-0 top-0 h-12 shrink-0"
          aria-hidden
        />
      )}

      <Outlet />
    </>
  )
}

export default App
