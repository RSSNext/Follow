import { apiClient } from "@renderer/lib/api-fetch"
import { FeedViewType } from "@renderer/lib/enum"
import { capitalizeFirstLetter } from "@renderer/lib/utils"
import type { SubscriptionModel } from "@renderer/models"
import { SubscriptionService } from "@renderer/services"
import { produce } from "immer"
import { omit } from "lodash-es"
import { parse } from "tldts"

import { isHydrated } from "../../initialize/hydrate"
import { entryActions } from "../entry"
import { feedActions, getFeedById } from "../feed"
import { feedUnreadActions } from "../unread"
import { createZustandStore } from "../utils/helper"

export type SubscriptionPlainModel = Omit<SubscriptionModel, "feeds">
interface SubscriptionState {
  /**
   * Key: feedId
   * Value: SubscriptionPlainModel
   */
  data: Record<FeedId, SubscriptionPlainModel>
  /**
   * Key: FeedViewType
   * Value: FeedId[]
   */
  dataIdByView: Record<FeedViewType, FeedId[]>
}

function morphResponseData(data: SubscriptionModel[]) {
  for (const subscription of data) {
    if (!subscription.category && subscription.feeds) {
      const { siteUrl } = subscription.feeds
      if (!siteUrl) continue
      const parsed = parse(siteUrl)
      parsed.domain &&
      (subscription.category = capitalizeFirstLetter(parsed.domain))
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

export const useSubscriptionStore = createZustandStore<SubscriptionState>(
  "subscription",
)(() => ({
  data: {},
  dataIdByView: { ...emptyDataIdByView },
}))

const set = useSubscriptionStore.setState
const get = useSubscriptionStore.getState

class SubscriptionActions {
  async fetchByView(view?: FeedViewType) {
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
    this.upsertMany(res.data)
    feedActions.upsertMany(res.data.map((s) => s.feeds))

    return res.data
  }

  upsertMany(subscriptions: SubscriptionPlainModel[]) {
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
  }

  markReadByView(view?: FeedViewType) {
    const state = get()
    for (const feedId in state.data) {
      if (state.data[feedId].view === view) {
        feedUnreadActions.updateByFeedId(feedId, 0)
        entryActions.patchManyByFeedId(feedId, { read: true })
      }
    }
  }

  markReadByFolder(folder: string) {
    const state = get()
    for (const feedId in state.data) {
      if (state.data[feedId].category === folder) {
        feedUnreadActions.updateByFeedId(feedId, 0)
        entryActions.patchManyByFeedId(feedId, { read: true })
      }
    }
  }

  clear() {
    set({
      data: {},
      dataIdByView: { ...emptyDataIdByView },
    })
  }

  deleteCategory(ids: string[]) {
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
            parsed.domain &&
            (subscription.category = capitalizeFirstLetter(parsed.domain))
          }
        })
      }),
    )
  }

  async unfollow(feedId: string) {
    const feed = getFeedById(feedId)
    // Remove feed and subscription
    set((state) =>
      produce(state, (draft) => {
        delete draft.data[feedId]
        for (const view in draft.dataIdByView) {
          const currentViewFeedIds = draft.dataIdByView[view] as string[]
          currentViewFeedIds.splice(currentViewFeedIds.indexOf(feedId), 1)
        }
      }),
    )

    // Remove feed's entries
    entryActions.clearByFeedId(feedId)
    // Clear feed's unread count
    feedUnreadActions.updateByFeedId(feedId, 0)

    return apiClient.subscriptions
      .$delete({
        json: {
          feedId,
        },
      })
      .then(() => feed)
  }
}

export const subscriptionActions = new SubscriptionActions()

export const getSubscriptionByFeedId = (feedId: FeedId) => {
  const state = get()
  return state.data[feedId]
}
