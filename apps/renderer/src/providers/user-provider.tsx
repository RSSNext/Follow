import { useEffect } from "react"

import { setWhoami } from "~/atoms/user"
import { setIntegrationIdentify } from "~/initialize/helper"
import { tipcClient } from "~/lib/client"
import { useSession } from "~/queries/auth"
import { CleanerService } from "~/services/cleaner"

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
