import { authConfigManager } from "@hono/auth-js/react"
import {
  browserDB,
  getShouldUseIndexedDB,
  subscribeShouldUseIndexedDB,
} from "@renderer/database"
import { enableMapSet } from "immer"

import { hydrateDatabaseToStore, setHydrated } from "./store/utils/hydrate"

const cleanup = subscribeShouldUseIndexedDB((value) => {
  if (!value) {
    browserDB.delete()
    setHydrated(false)
    return
  }
  setHydrated(true)
})
export const initializeApp = async () => {
  enableMapSet()
  // Initialize the database
  if (getShouldUseIndexedDB()) {
    await hydrateDatabaseToStore()
  }

  // Initialize the auth config
  authConfigManager.setConfig({
    baseUrl: import.meta.env.VITE_API_URL,
    basePath: "/auth",
    credentials: "include",
  })
}

import.meta.hot?.dispose(cleanup)
