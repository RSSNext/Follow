import type { FeedViewType } from "@follow/constants"

import type { UnreadSchema } from "@/src/database/schemas/types"
import { apiClient } from "@/src/lib/api-fetch"
import { UnreadService } from "@/src/services/unread"

import { createTransaction, createZustandStore } from "../internal/helper"
import { getSubscriptionByView } from "../subscription/getter"

type SubscriptionId = string
interface UnreadStore {
  data: Record<SubscriptionId, number>
}
export const useUnreadStore = createZustandStore<UnreadStore>("unread")(() => ({
  data: {},
}))
const set = useUnreadStore.setState

class UnreadSyncService {
  async fetch() {
    const res = await apiClient.reads.$get({
      query: {},
    })

    await unreadActions.upsertMany(res.data)
    return res.data
  }

  async markViewAsRead(view: FeedViewType) {
    await apiClient.reads.all.$post({
      json: {
        view,
      },
    })

    const subscriptionIds = getSubscriptionByView(view)
    await unreadActions.upsertMany(subscriptionIds.map((id) => ({ subscriptionId: id, count: 0 })))
  }

  async markAsRead(feedId: string) {
    await apiClient.reads.all.$post({
      json: { feedId },
    })

    await unreadActions.upsertMany([{ subscriptionId: feedId, count: 0 }])
  }

  async markAsReadMany(feedIds: string[]) {
    await apiClient.reads.all.$post({
      json: { feedIdList: feedIds },
    })

    await unreadActions.upsertMany(feedIds.map((id) => ({ subscriptionId: id, count: 0 })))
  }
}

class UnreadActions {
  async upsertManyInSession(unreads: UnreadSchema[]) {
    const state = useUnreadStore.getState()
    const nextData = { ...state.data }
    for (const unread of unreads) {
      nextData[unread.subscriptionId] = unread.count
    }
    set({
      data: nextData,
    })
  }

  async upsertMany(unreads: UnreadSchema[] | Record<SubscriptionId, number>) {
    const tx = createTransaction()

    const normalizedUnreads = Array.isArray(unreads)
      ? unreads
      : Object.entries(unreads).map(([subscriptionId, count]) => ({ subscriptionId, count }))
    tx.store(() => this.upsertManyInSession(normalizedUnreads))
    tx.persist(() => {
      return UnreadService.upsertMany(normalizedUnreads)
    })
    await tx.run()
  }

  reset() {
    set({
      data: {},
    })
  }
}
export const unreadActions = new UnreadActions()
export const unreadSyncService = new UnreadSyncService()
