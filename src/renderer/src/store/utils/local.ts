import { entryActions } from "../entry/entry"
import { subscriptionActions } from "../subscription"
import { uiActions } from "../ui"
import { unreadActions } from "../unread"

export const clearLocalPersistStoreData = () => {
  // All clear and reset method will aggregate here
  [entryActions, subscriptionActions, unreadActions, uiActions].forEach(
    (actions) => {
      actions.clear()
    },
  )
}
