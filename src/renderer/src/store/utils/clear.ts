import { clearUISettings } from "@renderer/atoms"
import { browserDB } from "@renderer/database"

import { entryActions } from "../entry"
import { feedActions } from "../feed"
import { subscriptionActions } from "../subscription"
import { unreadActions } from "../unread"

export const clearLocalPersistStoreData = () => {
  // All clear and reset method will aggregate here
  [
    entryActions,
    subscriptionActions,
    unreadActions,
    feedActions,
  ].forEach((actions) => {
    actions.clear()
  })

  clearUISettings()

  browserDB.delete()
}
