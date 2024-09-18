import { setWhoami } from "@renderer/atoms/user"
import { setIntegrationIdentify } from "@renderer/initialize/helper"
import { tipcClient } from "@renderer/lib/client"
import { useSession } from "@renderer/queries/auth"
import { CleanerService } from "@renderer/services/cleaner"
import { useEffect } from "react"

export const UserProvider = () => {
  const { session } = useSession()

  useEffect(() => {
    if (!session?.user) return
    setWhoami(session.user)

    setIntegrationIdentify(session.user)

    tipcClient?.trackerIdentify({
      user: session.user,
    })
    CleanerService.cleanRemainingData(session.user.id)
  }, [session?.user])

  return null
}
