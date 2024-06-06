import { apiClient } from "@renderer/lib/api-fetch"
import type { FeedViewType } from "@renderer/lib/enum"
import { produce } from "immer"
import { omit } from "lodash-es"

import { createZustandStore } from "./utils/helper"

interface UnreadState {
  data: Record<string, number>
}
interface UnreadActions {
  updateByFeedId: (feedId: string, unread: number) => void
  fetchUnreadByView: (view?: FeedViewType) => Promise<Record<string, number>>
  incrementByFeedId: (feedId: string, inc: number) => void
}
export const useUnreadStore = createZustandStore<UnreadState & UnreadActions>(
  "unread",
)((set) => ({
  data: {},

  async fetchUnreadByView(view) {
    const unread = (
      await apiClient.reads.$get({ query: { view: String(view) } })
    )

    const { data } = unread
    for (const feedId in data) {
      set((state) =>
        produce(state, (state) => {
          state.data[feedId] = data[feedId]
          return state
        }),
      )
    }
    return data
  },
  incrementByFeedId: (feedId, inc: number) => {
    set((state) =>
      produce(state, (state) => {
        const cur = state.data[feedId]
        if (cur === undefined) return state
        state.data[feedId] = (cur || 0) + inc
        return state
      }),
    )
  },
  updateByFeedId: (feedId, unread) => {
    set((state) =>
      produce(state, (state) => {
        state.data[feedId] = unread
        return state
      }),
    )
  },
}))

export const unreadActions = {
  ...omit(useUnreadStore.getState(), ["data"]),
}
