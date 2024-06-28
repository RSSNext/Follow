import { apiClient } from "@renderer/lib/api-fetch"
import { FeedViewType } from "@renderer/lib/enum"
import type { SubscriptionModel } from "@renderer/models"
import { SubscriptionService } from "@renderer/services"
import { produce } from "immer"
import { omit } from "lodash-es"

import { entryActions } from "./entry/store"
import { feedActions } from "./feed"
import { unreadActions } from "./unread"
import { createZustandStore, getStoreActions } from "./utils/helper"
import { isHydrated } from "./utils/hydrate"

type FeedId = string
export type SubscriptionPlainModel = Omit<SubscriptionModel, "feeds">
interface SubscriptionState {
  data: Record<FeedId, SubscriptionPlainModel>
  dataIdByView: Record<FeedViewType, FeedId[]>
}

interface SubscriptionActions {
  upsertMany: (subscription: SubscriptionPlainModel[]) => void
  fetchByView: (view?: FeedViewType) => Promise<SubscriptionPlainModel[]>
  markReadByView: (view?: FeedViewType) => void
  internal_reset: () => void
  clear: () => void
  deleteCategory: (ids: string[]) => void
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

    get().upsertMany(res.data)
    feedActions.upsertMany(res.data.map((s) => s.feeds))

    return res.data
  },
  upsertMany: (subscriptions) => {
    if (isHydrated()) {
      SubscriptionService.upsertMany(subscriptions)
    }
    set((state) =>
      produce(state, (state) => {
        subscriptions.forEach((subscription) => {
          state.data[subscription.feedId] = omit(subscription, "feeds")
          state.dataIdByView[subscription.view].push(subscription.feedId)

          return state
        })
      }),
    )
  },
  markReadByView(view) {
    const state = get()
    for (const feedId in state.data) {
      if (state.data[feedId].view === view) {
        unreadActions.updateByFeedId(feedId, 0)
        entryActions.patchManyByFeedId(feedId, { read: true })
      }
    }
  },
  deleteCategory(ids) {
    const idSet = new Set(ids)

    set((state) =>
      produce(state, (state) => {
        Object.keys(state.data).forEach((id) => {
          if (idSet.has(id)) {
            state.data[id].category = null
          }
        })
      }),
    )
  },
}))

export const subscriptionActions = getStoreActions(useSubscriptionStore)

export const useFeedIdByView = (view: FeedViewType) =>
  useSubscriptionStore((state) => state.dataIdByView[view] || [])
export const useSubscriptionByView = (view: FeedViewType) =>
  useSubscriptionStore((state) =>
    state.dataIdByView[view].map((id) => state.data[id]),
  )
