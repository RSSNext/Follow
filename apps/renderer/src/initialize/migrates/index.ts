import { getStorageNS } from "@follow/utils/ns"

import { appLog } from "~/lib/log"

const appVersionKey = getStorageNS("app_version")

declare global {
  interface Window {
    __app_is_upgraded__: boolean
  }
}

export const doMigration = async () => {
  const lastVersion = localStorage.getItem(appVersionKey)
  if (!lastVersion || lastVersion === APP_VERSION) {
    if (!lastVersion) {
      localStorage.setItem(appVersionKey, APP_VERSION)
    }
    return
  }
  // NOTE: Add migration logic here

  if (!APP_VERSION.includes("nightly")) {
    window.__app_is_upgraded__ = true
  }
  appLog(`Upgrade from ${lastVersion} to ${APP_VERSION}`)

  localStorage.setItem(appVersionKey, APP_VERSION)
}
