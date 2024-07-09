import { authConfigManager } from "@hono/auth-js/react"
import { browserDB } from "@renderer/database"
import * as Sentry from "@sentry/react"
import { registerGlobalContext } from "@shared/bridge"
import { enableMapSet } from "immer"
import { toast } from "sonner"

import { subscribeNetworkStatus } from "./atoms/network"
import { initializeSettings } from "./atoms/settings"
import {
  getGeneralSettings,
  subscribeShouldUseIndexedDB,
} from "./atoms/settings/general"
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

const initSentry = () => {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    // Performance Monitoring
    tracesSampleRate: 1, //  Capture 100% of the transactions
    // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  })
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
