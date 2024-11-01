import { getStorageNS } from "@follow/utils/ns"

import { appLog } from "~/lib/log"

const appVersionKey = getStorageNS("app_version")

declare global {
  interface Window {
    __app_is_upgraded__: boolean
  }
}
export const doMigration = () => {
  const lastVersion = localStorage.getItem(appVersionKey)

  if (lastVersion && lastVersion !== APP_VERSION) {
    appLog(`Upgrade from ${lastVersion} to ${APP_VERSION}`)
    window.__app_is_upgraded__ = true

    // NOTE: Add migration logic here
  }
  localStorage.setItem(appVersionKey, APP_VERSION)
}
