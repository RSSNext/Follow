import { clearUISettings } from "~/atoms/settings/ui"
import { browserDB } from "~/database"
import { getStorageNS } from "~/lib/ns"

import { entryActions } from "../entry"
import { feedActions } from "../feed"
import { clearImageDimensionsDb } from "../image/db"
import { inboxActions } from "../inbox"
import { listActions } from "../list"
import { subscriptionActions } from "../subscription"
import { feedUnreadActions } from "../unread"

export const clearLocalPersistStoreData = async () => {
  // All clear and reset method will aggregate here
  ;[
    entryActions,
    subscriptionActions,
    feedUnreadActions,
    feedActions,
    listActions,
    inboxActions,
  ].forEach((actions) => {
    actions.clear()
  })

  clearUISettings()

  await clearImageDimensionsDb()
  await browserDB.delete().catch(() => null)
}

const storedUserId = getStorageNS("user_id")
export const clearDataIfLoginOtherAccount = (newUserId: string) => {
  const oldUserId = localStorage.getItem(storedUserId)
  localStorage.setItem(storedUserId, newUserId)
  if (oldUserId !== newUserId) {
    return clearLocalPersistStoreData()
  }
}
