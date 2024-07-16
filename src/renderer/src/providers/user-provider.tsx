import { useSetMe } from "@renderer/atoms/user"
import { useSession } from "@renderer/queries/auth"
import { useEffect } from "react"

export const UserProvider = () => {
  const { session } = useSession()
  const setUser = useSetMe()
  useEffect(() => {
    if (!session?.user) return
    setUser(session.user)

    window.posthog?.identify(session.user.id, {
      name: session.user.name,
      handle: session.user.handle,
    })
  }, [session?.user, setUser])

  return null
}
