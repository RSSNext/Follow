import { useEffect, useState } from "react"
import { ActiveList, ActiveEntry } from "@renderer/lib/types"
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
