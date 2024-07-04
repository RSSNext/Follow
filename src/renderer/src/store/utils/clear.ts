import { clearUISettings } from "@renderer/atoms/ui"
import { browserDB } from "@renderer/database"

import { entryActions } from "../entry"
import { feedActions } from "../feed"
import { subscriptionActions } from "../subscription"
import { feedUnreadActions } from "../unread"

export const clearLocalPersistStoreData = () => {
  // All clear and reset method will aggregate here
  [
    entryActions,
    subscriptionActions,
    feedUnreadActions,
    feedActions,
  ].forEach((actions) => {
    actions.clear()
  })

  clearUISettings()

  browserDB.delete()
}
