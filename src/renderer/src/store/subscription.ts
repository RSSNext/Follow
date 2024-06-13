import { apiClient } from "@renderer/lib/api-fetch"
import { FeedViewType } from "@renderer/lib/enum"
import type { SubscriptionModel } from "@renderer/models"
import { produce } from "immer"

import { entryActions } from "./entry/entry"
import { unreadActions } from "./unread"
import { createZustandStore, getStoreActions } from "./utils/helper"

type FeedId = string
interface SubscriptionState {
  data: Record<FeedId, SubscriptionModel>
  dataIdByView: Record<FeedViewType, FeedId[]>
}

interface SubscriptionActions {
  upsert: (feedId: FeedId, subscription: SubscriptionModel) => void
  fetchByView: (view?: FeedViewType) => Promise<SubscriptionModel[]>
  markReadByView: (view?: FeedViewType) => void
  internal_reset: () => void
  clear: () => void
}

const emptyDataIdByView: Record<FeedViewType, FeedId[]> = {
  [FeedViewType.Articles]: [],
  [FeedViewType.Audios]: [],
  [FeedViewType.Notifications]: [],
  [FeedViewType.Pictures]: [],
  [FeedViewType.SocialMedia]: [],
  [FeedViewType.Videos]: [],
}

export const useSubscriptionStore = createZustandStore<
  SubscriptionState & SubscriptionActions
>("subscription", {
  version: 1,
})((set, get) => ({
  data: {},
  dataIdByView: { ...emptyDataIdByView },

  internal_reset() {
    set({
      data: {},
      dataIdByView: { ...emptyDataIdByView },
    })
  },
  clear() {
    get().internal_reset()
  },
  async fetchByView(view) {
    const res = await apiClient.subscriptions.$get({
      query: { view: String(view) },
    })

    // reset dataIdByView
    if (view !== undefined) {
      set((state) => ({
        ...state,
        dataIdByView: { ...state.dataIdByView, [view]: [] },
      }))
    } else {
      set((state) => ({
        ...state,
        dataIdByView: { ...emptyDataIdByView },
      }))
    }

    set((state) => produce(state, (state) => {
      res.data.forEach((subscription) => {
        state.data[subscription.feeds.id] = subscription
        state.dataIdByView[subscription.view].push(subscription.feeds.id)
        return state
      })
    }))

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

export const useFeedIdByView = (view: FeedViewType) =>
  useSubscriptionStore((state) => state.dataIdByView[view] || [])
export const useSubscriptionByView = (view: FeedViewType) =>
  useSubscriptionStore((state) =>
    state.dataIdByView[view].map((id) => state.data[id]),
  )
