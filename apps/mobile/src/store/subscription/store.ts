import { FeedViewType } from "@follow/constants"

import type { SubscriptionSchema } from "@/src/database/schemas/types"
import { apiClient } from "@/src/lib/api-fetch"
import { honoMorph } from "@/src/morph/hono"
import { SubscriptionService } from "@/src/services/subscription"

import { feedActions } from "../feed/store"
import { inboxActions } from "../inbox/store"
import { createImmerSetter, createTransaction, createZustandStore } from "../internal/helper"
import { listActions } from "../list/store"

type FeedId = string

export type SubscriptionModel = SubscriptionSchema
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
          if (subscription.feedId && subscription.type === "feed") {
            draft.data[subscription.feedId] = subscription
            draft.subscriptionIdSet.add(`${subscription.type}/${subscription.feedId}`)
            draft.feedIdByView[subscription.view as FeedViewType].push(subscription.feedId)
          }
        }
      })
    })

    tx.persist(() => {
      return SubscriptionService.upsertMany(subscriptions)
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

    const { subscriptions, feeds, lists, inboxes } = honoMorph.toSubscription(res.data)
    feedActions.upsertMany(feeds)
    subscriptionActions.upsertMany(subscriptions)
    listActions.upsertMany(lists)
    inboxActions.upsertMany(inboxes)

    return {
      subscriptions,
      feeds,
    }
  }
}

export const subscriptionActions = new SubscriptionActions()
export const subscriptionSyncService = new SubscriptionSyncService()
