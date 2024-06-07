import { useSession } from "@hono/auth-js/react"
import { feedActions, useFeedStore } from "@renderer/store"
import { useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"

function MainLayout() {
  const { status } = useSession()
  const navigate = useNavigate()

  const changed = useFeedStore(
    (state) => `${state.activeList?.view}-${state.activeList?.id}`,
  )

  useEffect(() => {
    feedActions.setActiveEntry(null)
    if (changed) {
      navigate("/")
    }
  }, [changed])

  if (status !== "authenticated") {
    navigate("/login")
    return null
  }

  return <Outlet />
}

export { MainLayout as Component }
