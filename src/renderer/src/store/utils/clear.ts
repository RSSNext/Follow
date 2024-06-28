import { browserDB } from "@renderer/database"

import { entryActions } from "../entry"
import { feedActions } from "../feed"
import { subscriptionActions } from "../subscription"
import { uiActions } from "../ui"
import { unreadActions } from "../unread"

export const clearLocalPersistStoreData = () => {
  // All clear and reset method will aggregate here
  [
    entryActions,
    subscriptionActions,
    unreadActions,
    uiActions,
    feedActions,
  ].forEach((actions) => {
    actions.clear()
  })

  browserDB.delete()
}
