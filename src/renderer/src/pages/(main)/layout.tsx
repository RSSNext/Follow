import { FeedColumn } from "@renderer/components/feed-column"
import { useEffect, useState } from "react"
import { ActivedList, ActivedEntry } from "@renderer/lib/types"
import { Outlet } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { useSession } from "@hono/auth-js/react"

export function Component() {
  const { status } = useSession()
  const navigate = useNavigate()
  const [activedList, setActivedList] = useState<ActivedList>({
    level: "view",
    id: 0,
    name: "Articles",
    view: 0,
  })
  const [activedEntry, setActivedEntry] = useState<ActivedEntry>(null)

  useEffect(() => {
    setActivedEntry(null)
    if (!activedList?.preventNavigate) {
      navigate("/")
    }
  }, [activedList])

  if (status !== "authenticated") {
    return navigate("/login")
  }

  return (
    <div className="flex h-full">
      <div className="w-64 pt-10 border-r shrink-0 bg-native">
        <FeedColumn activedList={activedList} setActivedList={setActivedList} />
      </div>
      <Outlet
        context={{
          activedList,
          activedEntry,
          setActivedEntry,
        }}
      />
    </div>
  )
}
