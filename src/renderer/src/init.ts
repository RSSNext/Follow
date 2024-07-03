import { authConfigManager } from "@hono/auth-js/react"
import {
  browserDB,
  getShouldUseIndexedDB,
  subscribeShouldUseIndexedDB,
} from "@renderer/database"
import { enableMapSet } from "immer"

import { APP_NAME } from "./lib/constants"
import { appLog } from "./lib/log"
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
  const now = Date.now()
  appLog(`${APP_NAME}: Next generation information browser`, `https://github.com/RSSNext/follow`)
  appLog(`Initialize ${APP_NAME}...`)
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
  appLog(`Initialize ${APP_NAME} done,`, `${Date.now() - now}ms`)
}

import.meta.hot?.dispose(cleanup)
