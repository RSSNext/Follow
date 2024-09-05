import { env } from "@env"
import { authConfigManager } from "@hono/auth-js/react"
import { repository } from "@pkg"
import { getUISettings } from "@renderer/atoms/settings/ui"
import { isElectronBuild } from "@renderer/constants"
import { browserDB } from "@renderer/database"
import { getStorageNS } from "@renderer/lib/ns"
import { settingSyncQueue } from "@renderer/modules/settings/helper/sync-queue"
import {
  ElectronCloseEvent,
  ElectronShowEvent,
} from "@renderer/providers/invalidate-query-provider"
import { CleanerService } from "@renderer/services/cleaner"
import { registerGlobalContext } from "@shared/bridge"
import dayjs from "dayjs"
import duration from "dayjs/plugin/duration"
import localizedFormat from "dayjs/plugin/localizedFormat"
import relativeTime from "dayjs/plugin/relativeTime"
import { enableMapSet } from "immer"
import { createElement } from "react"
import { toast } from "sonner"

import { subscribeNetworkStatus } from "../atoms/network"
import {
  getGeneralSettings,
  subscribeShouldUseIndexedDB,
} from "../atoms/settings/general"
import { appLog } from "../lib/log"
import {
  hydrateDatabaseToStore,
  hydrateSettings,
  setHydrated,
} from "./hydrate"
import { initPostHog } from "./posthog"
import { waitAppReady } from "./queue"
import { initSentry } from "./sentry"

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

declare global {
  interface Window {
    version: string
  }
}

const appVersionKey = getStorageNS("app_version")

export const initializeApp = async () => {
  appLog(`${APP_NAME}: Next generation information browser`, repository.url)
  appLog(`Initialize ${APP_NAME}...`)
  window.version = APP_VERSION

  const now = Date.now()

  // Set Environment
  document.documentElement.dataset.buildType = isElectronBuild ?
    "electron" :
    "web"

  const lastVersion = localStorage.getItem(appVersionKey)

  if (lastVersion && lastVersion !== APP_VERSION) {
    appLog(`Upgrade from ${lastVersion} to ${APP_VERSION}`)

    waitAppReady(() => {
      toast.success(
        // `App is upgraded to ${APP_VERSION}, enjoy the new features! 🎉`,
        createElement("div", {
          children: [
            "App is upgraded to ",
            createElement(
              "a",
              {
                href: `${repository.url}/releases/tag/${APP_VERSION}`,
                target: "_blank",
                className: "underline",
              },
              createElement("strong", {
                children: APP_VERSION,
              }),
            ),
            ", enjoy the new features! 🎉",
          ],
        }),
      )
    }, 1000)
  }
  localStorage.setItem(appVersionKey, APP_VERSION)

  // Initialize dayjs
  dayjs.extend(duration)
  dayjs.extend(relativeTime)
  dayjs.extend(localizedFormat)

  // Enable Map/Set in immer
  enableMapSet()

  subscribeNetworkStatus()

  registerGlobalContext({
    showSetting: (path) => window.router.showSettings(path),
    getGeneralSettings,
    getUISettings,
    /**
     * Electron app only
     */
    electronClose() {
      document.dispatchEvent(new ElectronCloseEvent())
    },
    electronShow() {
      document.dispatchEvent(new ElectronShowEvent())
    },

    toast,
  })

  hydrateSettings()

  settingSyncQueue.init()
  // await settingSyncQueue.replaceRemote()

  // should after hydrateSettings
  const { dataPersist: enabledDataPersist, sendAnonymousData } =
    getGeneralSettings()

  initSentry()
  if (sendAnonymousData) initPostHog()

  let dataHydratedTime: undefined | number
  // Initialize the database
  if (enabledDataPersist) {
    dataHydratedTime = await hydrateDatabaseToStore()
    CleanerService.cleanOutdatedData()
  }

  // Initialize the auth config
  authConfigManager.setConfig({
    baseUrl: env.VITE_API_URL,
    basePath: "/auth",
    credentials: "include",
  })
  const loadingTime = Date.now() - now
  appLog(`Initialize ${APP_NAME} done,`, `${loadingTime}ms`)

  window.posthog?.capture("app_init", {
    electron: !!window.electron,
    loading_time: loadingTime,
    using_indexed_db: enabledDataPersist,
    data_hydrated_time: dataHydratedTime,
    version: APP_VERSION,
  })
}

import.meta.hot?.dispose(cleanup)
