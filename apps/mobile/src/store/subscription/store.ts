import { FeedViewType } from "@follow/constants"

import type { SubscriptionModel } from "@/src/database/schemas/types"
import { morph } from "@/src/hono/morph"
import { apiClient } from "@/src/lib/api-fetch"
import { subscriptionService } from "@/src/services/subscription"

import { feedActions } from "../feed/store"
import { createImmerSetter, createTransaction, createZustandStore } from "../internal/helper"

type FeedId = string

interface SubscriptionState {
  /**
   * Key: feedId
   * Value: SubscriptionPlainModel
   */
  data: Record<FeedId, SubscriptionModel>
  /**
   * Key: FeedViewType
   * Value: FeedId[]
   */
  feedIdByView: Record<FeedViewType, FeedId[]>
  /**
   * Key: FeedViewType
   * Value: Record<string, boolean>
   */
  categoryOpenStateByView: Record<FeedViewType, Record<string, boolean>>
  /**
   * All named categories names set
   */
  categories: Set<string>
  /**
   * All subscription ids set
   */
  subscriptionIdSet: Set<string>
}

const emptyDataIdByView: Record<FeedViewType, FeedId[]> = {
  [FeedViewType.Articles]: [],
  [FeedViewType.Audios]: [],
  [FeedViewType.Notifications]: [],
  [FeedViewType.Pictures]: [],
  [FeedViewType.SocialMedia]: [],
  [FeedViewType.Videos]: [],
}
const emptyCategoryOpenStateByView: Record<FeedViewType, Record<string, boolean>> = {
  [FeedViewType.Articles]: {},
  [FeedViewType.Audios]: {},
  [FeedViewType.Notifications]: {},
  [FeedViewType.Pictures]: {},
  [FeedViewType.SocialMedia]: {},
  [FeedViewType.Videos]: {},
}
export const useSubscriptionStore = createZustandStore<SubscriptionState>("subscription")(() => ({
  data: {},
  feedIdByView: { ...emptyDataIdByView },
  categoryOpenStateByView: { ...emptyCategoryOpenStateByView },
  categories: new Set(),
  subscriptionIdSet: new Set(),
}))
// const get = useSubscriptionStore.getState

const immerSet = createImmerSetter(useSubscriptionStore)
class SubscriptionActions {
  async upsertMany(subscriptions: SubscriptionModel[]) {
    const tx = createTransaction()
    tx.store(() => {
      immerSet((draft) => {
        for (const subscription of subscriptions) {
          if (subscription.feedId) {
            draft.data[subscription.feedId] = subscription
            draft.subscriptionIdSet.add(`feed/${subscription.feedId}`)
            draft.feedIdByView[subscription.view as FeedViewType].push(subscription.feedId)
          }
        }
      })
    })

    tx.persist(() => {
      return subscriptionService.upsertMany(subscriptions)
    })

    await tx.run()
  }

  reset(view: FeedViewType) {
    immerSet((draft) => {
      draft.feedIdByView[view] = []
      draft.categoryOpenStateByView[view] = {}
    })
  }
}
class SubscriptionSyncService {
  async fetch(view: FeedViewType) {
    const res = await apiClient.subscriptions.$get({
      query: {
        view: view !== undefined ? String(view) : undefined,
      },
    })

    subscriptionActions.reset(view)

    const { subscriptions, feeds } = morph.toSubscription(res.data)
    feedActions.upsertMany(feeds)
    subscriptionActions.upsertMany(subscriptions)

    return {
      subscriptions,
      feeds,
    }
  }
}

export const subscriptionActions = new SubscriptionActions()
export const subscriptionSyncService = new SubscriptionSyncService()
