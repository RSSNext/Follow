import { apiClient } from "@renderer/lib/api-fetch"
import { entryActions } from "@renderer/store/entry"
import { create, keyResolver, windowScheduler } from "@yornaath/batshit"

type EntryId = string
type FeedId = string
const unread = create({
  fetcher: async (ids: [FeedId, EntryId][]) => {
    await apiClient.reads.$post({ json: { entryIds: ids.map((i) => i[1]) } })
    for (const [feedId, entryId] of ids) {
      entryActions.markRead(feedId, entryId, true)
    }
    return []
  },
  resolver: keyResolver("id"),
  scheduler: windowScheduler(1000),
})

export const batchMarkUnread = unread.fetch
