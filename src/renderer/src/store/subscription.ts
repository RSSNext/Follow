import type { FeedViewType } from "@renderer/lib/enum"
import type { SubscriptionModel } from "@renderer/models"
import { apiClient } from "@renderer/queries/api-fetch"
import { produce } from "immer"
import { omit } from "lodash-es"
import { create } from "zustand"
import { persist } from "zustand/middleware"

import { zustandStorage } from "./utils/helper"

type FeedId = string
interface SubscriptionState {
  data: Record<FeedId, SubscriptionModel>
}
interface SubscriptionActions {
  upsert: (feedId: FeedId, subscription: SubscriptionModel) => void
  fetchByView: (view?: FeedViewType) => Promise<SubscriptionModel[]>
}
export const useSubscriptionStore = create(
  persist<SubscriptionState & SubscriptionActions>(
    (set) => ({
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
    }),
    {
      name: "subscription",
      storage: zustandStorage,
    },
  ),
)

export const subscriptionActions = {
  ...omit(useSubscriptionStore.getState(), ["data"]),
}
