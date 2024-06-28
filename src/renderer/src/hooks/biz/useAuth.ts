import { signOut } from "@hono/auth-js/react"
import { QUERY_PERSIST_KEY } from "@renderer/lib/constants"
import { clearLocalPersistStoreData } from "@renderer/store/utils/clear"
import { useCallback } from "react"

export const useSignOut = () =>
  useCallback(() => {
    signOut()

    // clear local store data
    clearLocalPersistStoreData()

    // Clear query cache
    localStorage.removeItem(QUERY_PERSIST_KEY)

    // Clear local storage
    // TODO
  }, [])
