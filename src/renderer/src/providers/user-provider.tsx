import { useSetWhoami } from "@renderer/atoms/user"
import { tipcClient } from "@renderer/lib/client"
import { useSession } from "@renderer/queries/auth"
import { CleanerService } from "@renderer/services/cleaner"
import { useEffect } from "react"

export const UserProvider = () => {
  const { session } = useSession()
  const setUser = useSetWhoami()
  useEffect(() => {
    if (!session?.user) return
    setUser(session.user)

    window.posthog?.identify(session.user.id, {
      name: session.user.name,
      handle: session.user.handle,
    })

    tipcClient?.trackerIdentify({
      user: session.user,
    })
    CleanerService.cleanRemainingData(session.user.id)
  }, [session?.user, setUser])

  return null
}
