import { useSession } from "@hono/auth-js/react"
import { feedActions, useFeedStore } from "@renderer/store"
import { useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"

export function Component() {
  const { status } = useSession()
  const navigate = useNavigate()
  const preventNavigate = useFeedStore(
    (state) => state.activeList?.preventNavigate,
  )

  useEffect(() => {
    feedActions.setActiveEntry(null)
    if (!preventNavigate) {
      navigate("/")
    }
  }, [navigate, preventNavigate])

  if (status !== "authenticated") {
    navigate("/login")
    return null
  }

  return <Outlet />
}
