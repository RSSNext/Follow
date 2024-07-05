import { apiClient } from "@renderer/lib/api-fetch"
import { ROUTE_FEED_IN_FOLDER } from "@renderer/lib/constants"
import { FeedViewType } from "@renderer/lib/enum"
import type { SubscriptionModel } from "@renderer/models"
import { SubscriptionService } from "@renderer/services"
import { produce } from "immer"
import { omit } from "lodash-es"
import { parse } from "tldts"

import { entryActions } from "./entry/store"
import { feedActions, getFeedById } from "./feed"
import { feedUnreadActions } from "./unread"
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
  markReadByFolder: (folder: string) => void
  internal_reset: () => void
  clear: () => void
  deleteCategory: (ids: string[]) => void
}

function morphResponseData(data: SubscriptionModel[]) {
  for (const subscription of data) {
    if (!subscription.category && subscription.feeds) {
      const { siteUrl } = subscription.feeds
      if (!siteUrl) continue
      const parsed = parse(siteUrl)
      parsed.domain && (subscription.category = parsed.domain)
    }
  }
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

    morphResponseData(res.data)
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
        feedUnreadActions.updateByFeedId(feedId, 0)
        entryActions.patchManyByFeedId(feedId, { read: true })
      }
    }
  },
  markReadByFolder(folder) {
    const state = get()
    for (const feedId in state.data) {
      if (state.data[feedId].category === folder) {
        feedUnreadActions.updateByFeedId(feedId, 0)
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
            const subscription = state.data[id]
            const feed = getFeedById(subscription.feedId)
            if (!feed) return
            const { siteUrl } = feed
            if (!siteUrl) return
            const parsed = parse(siteUrl)
            parsed.domain && (subscription.category = parsed.domain)
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

export const useSubscriptionByFeedId = (feedId: FeedId) =>
  useSubscriptionStore((state) => state.data[feedId])

export const useFolderFeedsByFeedId = (feedId?: string) =>
  useSubscriptionStore((state) => {
    if (typeof feedId !== "string") return

    if (!feedId.startsWith(ROUTE_FEED_IN_FOLDER)) {
      return
    }
    const folderName = feedId.replace(ROUTE_FEED_IN_FOLDER, "")
    const feedIds: string[] = []
    for (const feedId in state.data) {
      const subscription = state.data[feedId]
      if (subscription.category === folderName) {
        feedIds.push(feedId)
      }
    }
    return feedIds
  })
