import { clearUISettings } from "~/atoms/settings/ui"
import { browserDB } from "~/database"

import { entryActions } from "../entry"
import { feedActions } from "../feed"
import { clearImageDimensionsDb } from "../image/db"
import { subscriptionActions } from "../subscription"
import { feedUnreadActions } from "../unread"

export const clearLocalPersistStoreData = async () => {
  // All clear and reset method will aggregate here
  ;[entryActions, subscriptionActions, feedUnreadActions, feedActions].forEach((actions) => {
    actions.clear()
  })

  clearUISettings()

  await clearImageDimensionsDb()
  await browserDB.delete().catch(() => null)
}
