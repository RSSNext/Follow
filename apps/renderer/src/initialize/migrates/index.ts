import { getStorageNS } from "@follow/utils/ns"
import * as semver from "semver"

import { appLog } from "~/lib/log"
import { FeedService } from "~/services/feed"

const appVersionKey = getStorageNS("app_version")

declare global {
  interface Window {
    __app_is_upgraded__: boolean
  }
}

async function migrationTipUser() {
  // Add migration logic here
  const feeds = await FeedService.findAll()
  const dirtyFeed = feeds.filter((feed) => !!feed.tipUsers && !Array.isArray(feed.tipUsers))
  dirtyFeed.forEach((feed) => {
    feed.tipUsers = []
  })
  await FeedService.upsertMany(dirtyFeed)
}

export const doMigration = async () => {
  const lastVersion = localStorage.getItem(appVersionKey)

  if (lastVersion && lastVersion !== APP_VERSION) {
    appLog(`Upgrade from ${lastVersion} to ${APP_VERSION}`)
    window.__app_is_upgraded__ = true

    try {
      if (semver.lte(lastVersion, "0.1.2-beta.0")) {
        await migrationTipUser()
      }
      // NOTE: Add migration logic here
    } catch (error) {
      console.error("Migration failed", error)
    }
  }
  localStorage.setItem(appVersionKey, APP_VERSION)
}
