import { signOut } from "@hono/auth-js/react"
import { setMe } from "@renderer/atoms/user"
import { QUERY_PERSIST_KEY } from "@renderer/constants"
import { clearStorage } from "@renderer/lib/ns"
import { clearLocalPersistStoreData } from "@renderer/store/utils/clear"
import { useCallback } from "react"

export const useSignOut = () =>
  useCallback(async () => {
    // clear local store data
    clearLocalPersistStoreData()

    // Clear query cache
    localStorage.removeItem(QUERY_PERSIST_KEY)

    // setLoginModalShow(true)
    setMe(null)

    // Clear local storage
    clearStorage()
    window.posthog?.reset()

    // Sign out
    await signOut()
  }, [])
