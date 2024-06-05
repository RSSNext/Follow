import type { FeedViewType } from "@renderer/lib/enum"
import type { SubscriptionModel } from "@renderer/models"
import { apiClient } from "@renderer/queries/api-fetch"
import { produce } from "immer"
import { omit } from "lodash-es"

import { entryActions } from "./entry"
import { unreadActions } from "./unread"
import { createZustandStore } from "./utils/helper"

type FeedId = string
interface SubscriptionState {
  data: Record<FeedId, SubscriptionModel>
}
interface SubscriptionActions {
  upsert: (feedId: FeedId, subscription: SubscriptionModel) => void
  fetchByView: (view?: FeedViewType) => Promise<SubscriptionModel[]>
  markReadByView: (view?: FeedViewType) => void
}
export const useSubscriptionStore = createZustandStore<
  SubscriptionState & SubscriptionActions
>("subscription")((set, get) => ({
  data: {},

  async fetchByView(view) {
    const res = await (
      await apiClient.subscriptions.$get({ query: { view: String(view) } })
    ).json()

    res.data.forEach((subscription: SubscriptionModel) => {
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

export const subscriptionActions = {
  ...omit(useSubscriptionStore.getState(), ["data"]),
}
