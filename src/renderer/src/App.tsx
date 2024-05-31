import { Outlet } from "react-router-dom"

import { useDark } from "./hooks/useDark"
import { handlers } from "./tipc"
import { useEffect } from "react"

import { queryClient } from "@renderer/lib/query-client"


function App() {
  useDark()

  useEffect(() => {
    const unlisten = handlers?.invalidateQuery.listen((queryKey) => {
      queryClient.invalidateQueries({
        queryKey,
      })
    })

    return unlisten
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
