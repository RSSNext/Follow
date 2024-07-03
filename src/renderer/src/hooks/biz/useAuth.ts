import { signOut } from "@hono/auth-js/react"
import { setUser } from "@renderer/atoms"
import { QUERY_PERSIST_KEY } from "@renderer/lib/constants"
import { clearLocalPersistStoreData } from "@renderer/store/utils/clear"
import { useCallback } from "react"

export const useSignOut = () =>
  useCallback(async () => {
    // clear local store data
    clearLocalPersistStoreData()

    // Clear query cache
    localStorage.removeItem(QUERY_PERSIST_KEY)

    // setLoginModalShow(true)
    setUser(null)

    // Clear local storage
    // TODO

    // Sign out
    await signOut()
  }, [])
