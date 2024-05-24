import { useEffect, useState } from "react"
import { ActiveList, ActivedEntry } from "@renderer/lib/types"
import { Outlet } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { useSession } from "@hono/auth-js/react"
import { MainLayoutOutlet } from "@renderer/contexts/outlet/main-layout"

export function Component() {
  const { status } = useSession()
  const navigate = useNavigate()
  const [activeList, setActiveList] = useState<ActiveList>({
    level: "view",
    id: 0,
    name: "Articles",
    view: 0,
  })
  const [activeEntry, setActiveEntry] = useState<ActivedEntry>(null)

  useEffect(() => {
    setActiveEntry(null)
    if (!activeList?.preventNavigate) {
      navigate("/")
    }
  }, [activeList])

  if (status !== "authenticated") {
    return navigate("/login")
  }

  return (
    <MainLayoutOutlet
      {...{
        activeList,
        activeEntry,
        setActiveEntry: setActiveEntry,
        setActiveList,
      }}
    />
  )
}
