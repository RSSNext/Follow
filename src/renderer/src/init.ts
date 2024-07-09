import { authConfigManager } from "@hono/auth-js/react"
import { version } from "@pkg"
import { browserDB } from "@renderer/database"
import { registerGlobalContext } from "@shared/bridge"
import { enableMapSet } from "immer"
import { useEffect } from "react"
import {
  createRoutesFromChildren,
  matchRoutes,
  useLocation,
  useNavigationType,
} from "react-router-dom"
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
  if (!window.SENTRY_RELEASE) return
  const Sentry = await import("@sentry/react")
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.VITE_BUILD_TYPE ?? "development",
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
      Sentry.moduleMetadataIntegration(),
      Sentry.reactRouterV6BrowserTracingIntegration({
        useEffect,
        useLocation,
        useNavigationType,
        createRoutesFromChildren,
        matchRoutes,
      }),
    ],
    ...SentryConfig,
  })

  Sentry.setTags({
    appVersion: version,
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
