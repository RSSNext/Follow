import { apiClient } from "@renderer/lib/api-fetch"
import type { FeedViewType } from "@renderer/lib/enum"
import type { SubscriptionModel } from "@renderer/models"
import { produce } from "immer"

import { entryActions } from "./entry"
import { unreadActions } from "./unread"
import { createZustandStore, getStoreActions } from "./utils/helper"

type FeedId = string
interface SubscriptionState {
  data: Record<FeedId, SubscriptionModel>
}
interface SubscriptionActions {
  upsert: (feedId: FeedId, subscription: SubscriptionModel) => void
  fetchByView: (view?: FeedViewType) => Promise<SubscriptionModel[]>
  markReadByView: (view?: FeedViewType) => void
  internal_reset: () => void
}
export const useSubscriptionStore = createZustandStore<
  SubscriptionState & SubscriptionActions
  >("subscription", {
    version: 0,
  })((set, get) => ({
    data: {},
    internal_reset() {
      set({ data: {} })
    },
    async fetchByView(view) {
      const res = await apiClient.subscriptions.$get({
        query: { view: String(view) },
      })

      get().internal_reset()
      res.data.forEach((subscription) => {
        set((state) =>
          produce(state, (state) => {
            state.data[subscription.feeds.id] = subscription
            return state
          }),
        )
      })

      return res.data
    },
    upsert: (feedId, subscription) => {
      set((state) =>
        produce(state, (state) => {
          state.data[feedId] = subscription
          return state
        }),
      )
    },
    markReadByView(view) {
      const state = get()
      for (const feedId in state.data) {
        if (state.data[feedId].view === view) {
          unreadActions.updateByFeedId(feedId, 0)
          entryActions.optimisticUpdateManyByFeedId(feedId, { read: true })
        }
      }
    },
  }))

export const subscriptionActions = getStoreActions(useSubscriptionStore)
