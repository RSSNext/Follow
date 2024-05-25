import { useSession } from "@hono/auth-js/react"
import { MainLayoutOutlet } from "@renderer/contexts/outlet/main-layout"
import type { ActiveEntry, ActiveList } from "@renderer/lib/types"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export function Component() {
  const { status } = useSession()
  const navigate = useNavigate()
  const [activeList, setActiveList] = useState<ActiveList>({
    level: "view",
    id: 0,
    name: "Articles",
    view: 0,
  })
  const [activeEntry, setActiveEntry] = useState<ActiveEntry>(null)

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
        setActiveEntry,
        setActiveList,
      }}
    />
  )
}
