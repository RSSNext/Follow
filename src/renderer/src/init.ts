import { authConfigManager } from "@hono/auth-js/react"
import { browserDB } from "@renderer/database"
import { init as reactInit } from "@sentry/react"
import { registerGlobalContext } from "@shared/bridge"
import { enableMapSet } from "immer"
import { toast } from "sonner"

import { subscribeNetworkStatus } from "./atoms/network"
import { initializeSettings } from "./atoms/settings"
import {
  getGeneralSettings,
  subscribeShouldUseIndexedDB,
} from "./atoms/settings/general"
import { SentryConfig } from "./configs"
import { APP_NAME } from "./lib/constants"
import { appLog } from "./lib/log"
import { hydrateDatabaseToStore, setHydrated } from "./store/utils/hydrate"

const cleanup = subscribeShouldUseIndexedDB((value) => {
  if (!value) {
    browserDB.tables.forEach((table) => {
      table.clear()
    })
    setHydrated(false)
    return
  }
  setHydrated(true)
})

const initSentry = async () => {
  if (window.electron) {
    const Sentry = await import("@sentry/electron/renderer")

    Sentry.init(
      {
        integrations: [
          Sentry.browserTracingIntegration(),
          Sentry.replayIntegration(),
          Sentry.moduleMetadataIntegration(),
        ],
        ...SentryConfig,
      },
      reactInit,
    )
  } else {
    const Sentry = await import("@sentry/react")
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration(),
        Sentry.moduleMetadataIntegration(),
      ],
      ...SentryConfig,
    })
  }
}

export const initializeApp = async () => {
  appLog(
    `${APP_NAME}: Next generation information browser`,
    `https://github.com/RSSNext/follow`,
  )
  appLog(`Initialize ${APP_NAME}...`)

  const now = Date.now()
  initSentry()
  subscribeNetworkStatus()

  registerGlobalContext({
    showSetting: () => window.router.showSettings(),
    toast,
  })

  initializeSettings()

  enableMapSet()

  // Initialize the database
  if (getGeneralSettings().dataPersist) {
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
