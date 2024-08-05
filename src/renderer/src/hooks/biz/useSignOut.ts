import { signOut } from "@hono/auth-js/react"
import { setMe } from "@renderer/atoms/user"
import { QUERY_PERSIST_KEY } from "@renderer/constants"
import { tipcClient } from "@renderer/lib/client"
import { clearStorage } from "@renderer/lib/ns"
import { clearLocalPersistStoreData } from "@renderer/store/utils/clear"
import { useCallback } from "react"

export const useSignOut = () =>
  useCallback(async () => {
    // Clear query cache
    localStorage.removeItem(QUERY_PERSIST_KEY)

    // setLoginModalShow(true)
    setMe(null)

    // Clear local storage
    clearStorage()
    window.posthog?.reset()
    // clear local store data
    await Promise.allSettled([
      clearLocalPersistStoreData(),
      tipcClient?.cleanAuthSessionToken(),
    ])
    // Sign out
    await signOut()
  }, [])
