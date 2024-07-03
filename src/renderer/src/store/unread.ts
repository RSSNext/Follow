import { apiClient } from "@renderer/lib/api-fetch"
import type { FeedViewType } from "@renderer/lib/enum"
import { FeedUnreadService } from "@renderer/services"

import { createZustandStore, getStoreActions } from "./utils/helper"

interface UnreadState {
  data: Record<string, number>
}
interface FeedUnreadActions {
  updateByFeedId: (feedId: string, unread: number) => void
  fetchUnreadByView: (view?: FeedViewType) => Promise<Record<string, number>>
  fetchUnreadAll: () => Promise<Record<string, number>>
  incrementByFeedId: (feedId: string, inc: number) => void

  subscribeUnreadCount: (
    fn: (count: number) => void,
    immediately?: boolean
  ) => () => void

  internal_reset: () => void
  internal_setValue: (data: [string, number][]) => void

  clear: () => void

  hydrate: (
    data: {
      id: string
      count: number
    }[],
  ) => void
}
/**
 * Store for `feed` unread count
 */
export const useFeedUnreadStore = createZustandStore<
  UnreadState & FeedUnreadActions
>("unread", {
  version: 1,
})((set, get) => ({
  data: {},

  internal_reset() {
    set({ data: {} })
    FeedUnreadService.clear()
  },

  clear() {
    this.internal_reset()
  },
  internal_setValue(data) {
    set((state) => {
      state.data = { ...state.data }
      for (const [key, value] of data) {
        state.data[key] = value
      }
      FeedUnreadService.updateFeedUnread(data)
      return { ...state }
    })
  },

  async fetchUnreadByView(view) {
    const unread = await apiClient.reads.$get({
      query: { view: String(view) },
    })

    const { data } = unread

    get().internal_setValue(Object.entries(data))

    return data
  },
  async fetchUnreadAll() {
    const unread = await apiClient.reads.$get({
      query: {},
    })

    const { data } = unread
    this.internal_reset()

    get().internal_setValue(Object.entries(data))
    return data
  },
  incrementByFeedId: (feedId, inc: number) => {
    const state = get()
    const cur = state.data[feedId]

    state.internal_setValue([[feedId, Math.max(0, (cur || 0) + inc)]])
  },
  updateByFeedId: (feedId, unread) => {
    get().internal_setValue([[feedId, unread]])
  },

  subscribeUnreadCount(fn, immediately) {
    const handler = (state: UnreadState & FeedUnreadActions): void => {
      let unread = 0
      for (const key in state.data) {
        unread += state.data[key]
      }

      fn(unread)
    }
    if (immediately) {
      handler(get())
    }
    return useFeedUnreadStore.subscribe(handler)
  },

  hydrate(data) {
    set((state) => {
      state.data = { ...state.data }

      for (const { id, count } of data) {
        state.data[id] = count
      }

      return { ...state }
    })
  },
}))

export const feedUnreadActions = getStoreActions(useFeedUnreadStore)
