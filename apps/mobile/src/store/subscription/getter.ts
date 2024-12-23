import type { FeedViewType } from "@follow/constants"

import type { SubscriptionModel } from "./store"
import { useSubscriptionStore } from "./store"

const get = useSubscriptionStore.getState
export const getSubscription = (id: string): SubscriptionModel | null => {
  return get().data[id] || null
}

export const getSubscriptionByView = (view: FeedViewType): string[] => {
  const state = get()
  return Array.from(state.feedIdByView[view])
    .concat(Array.from(state.inboxIdByView[view]))
    .concat(Array.from(state.listIdByView[view]))
}
