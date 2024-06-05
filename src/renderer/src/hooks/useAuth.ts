import { signOut } from "@hono/auth-js/react"
import { useCallback } from "react"

export const useSignOut = () => useCallback(() => {
  signOut()
}, [])
