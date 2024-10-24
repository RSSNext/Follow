import { clearStorage } from "@follow/utils/ns"
import { signOut } from "@hono/auth-js/react"
import { useCallback } from "react"

import { setWhoami } from "~/atoms/user"
import { QUERY_PERSIST_KEY } from "~/constants"
import { tipcClient } from "~/lib/client"
import { clearLocalPersistStoreData } from "~/store/utils/clear"

export const useSignOut = () =>
  useCallback(async () => {
    // Clear query cache
    localStorage.removeItem(QUERY_PERSIST_KEY)

    // setLoginModalShow(true)
    setWhoami(null)

    // Clear local storage
    clearStorage()
    window.analytics?.reset()
    // clear local store data
    await Promise.allSettled([clearLocalPersistStoreData(), tipcClient?.cleanAuthSessionToken()])
    // Sign out
    await signOut()
  }, [])
