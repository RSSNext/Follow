import { FeedViewType } from "@follow/constants"

import type { SubscriptionSchema } from "@/src/database/schemas/types"
import { apiClient } from "@/src/lib/api-fetch"
import { honoMorph } from "@/src/morph/hono"
import { storeDbMorph } from "@/src/morph/store-db"
import { SubscriptionService } from "@/src/services/subscription"

import { feedActions } from "../feed/store"
import { inboxActions } from "../inbox/store"
import { createImmerSetter, createTransaction, createZustandStore } from "../internal/helper"
import { listActions } from "../list/store"
import { getInboxStoreId } from "./utils"

type FeedId = string
type ListId = string
type InboxId = string
export type SubscriptionModel = Omit<SubscriptionSchema, "id">
interface SubscriptionState {
  /**
   * Key: feedId
   * Value: SubscriptionPlainModel
   */
  data: Record<FeedId, SubscriptionModel>

  feedIdByView: Record<FeedViewType, Set<FeedId>>

  listIdByView: Record<FeedViewType, Set<ListId>>

  inboxIdByView: Record<FeedViewType, Set<InboxId>>
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

const emptyDataIdByView: Record<FeedViewType, Set<FeedId>> = {
  [FeedViewType.Articles]: new Set(),
  [FeedViewType.Audios]: new Set(),
  [FeedViewType.Notifications]: new Set(),
  [FeedViewType.Pictures]: new Set(),
  [FeedViewType.SocialMedia]: new Set(),
  [FeedViewType.Videos]: new Set(),
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
  listIdByView: { ...emptyDataIdByView },
  inboxIdByView: { ...emptyDataIdByView },
  categoryOpenStateByView: { ...emptyCategoryOpenStateByView },
  categories: new Set(),
  subscriptionIdSet: new Set(),
}))
// const get = useSubscriptionStore.getState

const immerSet = createImmerSetter(useSubscriptionStore)
class SubscriptionActions {
  async upsertManyInSession(subscriptions: SubscriptionModel[]) {
    immerSet((draft) => {
      for (const subscription of subscriptions) {
        if (subscription.feedId && subscription.type === "feed") {
          draft.data[subscription.feedId] = subscription
          draft.subscriptionIdSet.add(`${subscription.type}/${subscription.feedId}`)
          draft.feedIdByView[subscription.view as FeedViewType].add(subscription.feedId)
        }
        if (subscription.listId && subscription.type === "list") {
          draft.data[subscription.listId] = subscription
          draft.subscriptionIdSet.add(`${subscription.type}/${subscription.listId}`)
          draft.listIdByView[subscription.view as FeedViewType].add(subscription.listId)
        }

        if (subscription.inboxId && subscription.type === "inbox") {
          draft.data[getInboxStoreId(subscription.inboxId)] = subscription
          draft.subscriptionIdSet.add(`${subscription.type}/${subscription.inboxId}`)
          draft.inboxIdByView[subscription.view as FeedViewType].add(subscription.inboxId)
        }
      }
    })
  }
  async upsertMany(subscriptions: SubscriptionModel[]) {
    const tx = createTransaction()
    tx.store(() => {
      this.upsertManyInSession(subscriptions)
    })

    tx.persist(() => {
      return SubscriptionService.upsertMany(
        subscriptions.map((s) => storeDbMorph.toSubscriptionSchema(s)),
      )
    })

    await tx.run()
  }

  reset(view: FeedViewType) {
    immerSet((draft) => {
      draft.feedIdByView[view] = new Set()
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
