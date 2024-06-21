import { useSetUser } from "@renderer/atoms/user"
import { useSession } from "@renderer/queries/auth"
import { useEffect } from "react"

export const UserProvider = () => {
  const { session } = useSession()
  const setUser = useSetUser()
  useEffect(() => {
    if (!session?.user) return
    setUser(session.user)
  }, [session?.user, setUser])

  return null
}
