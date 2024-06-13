import { apiClient } from "@renderer/lib/api-fetch"
import { FEED_COLLECTION_LIST } from "@renderer/lib/constants"
import type { FeedViewType } from "@renderer/lib/enum"
import { getEntriesParams } from "@renderer/lib/utils"
import type { EntryModel } from "@renderer/models"
import { produce } from "immer"
import { merge, omit } from "lodash-es"

import { useFeedIdByView } from "./subscription"
import { unreadActions } from "./unread"
import { createZustandStore, getStoreActions } from "./utils/helper"

type FeedId = string
type EntryId = string
type EntriesIdTable = Record<FeedId, EntryId[]>

interface EntryState {
  /**
   * A map of feedId to entryIds
   */
  entries: EntriesIdTable
  /**
   * A map of entryId to entry
   */
  flatMapEntries: Record<FeedId, EntryModel>
  /**
   * A map of feedId to entryId set, to quickly check if an entryId is in the feed
   * The array is used to keep the order of the entries, and this set is used to quickly check if an entryId is in the feed
   */

  internal_feedId2entryIdSet: Record<FeedId, Set<EntryId>>
}

interface EntryActions {
  fetchEntries: (params: {
    level?: string
    id?: number | string
    view?: number
    read?: boolean

    pageParam?: string
  }) => Promise<Awaited<ReturnType<typeof apiClient.entries.$post>>>
  fetchEntryById: (entryId: string) => Promise<EntryModel | undefined>
  upsertMany: (entries: EntryModel[]) => void

  optimisticUpdate: (entryId: string, changed: Partial<EntryModel>) => void
  optimisticUpdateManyByFeedId: (
    feedId: string,
    changed: Partial<EntryModel>
  ) => void
  optimisticUpdateAll: (changed: Partial<EntryModel>) => void
  getFlattenMapEntries: () => Record<string, EntryModel>
  markRead: (feedId: string, entryId: string, read: boolean) => void
  markReadByFeedId: (feedId: string) => void

  clear: () => void
}

export const useEntryStore = createZustandStore<EntryState & EntryActions>(
  "entry",
  {
    version: 1,
  },
)((set, get) => ({
  entries: {},
  flatMapEntries: {},
  internal_feedId2entryIdSet: {},

  clear: () => {
    set({
      entries: {},
      flatMapEntries: {},
      internal_feedId2entryIdSet: {},
    })
  },

  fetchEntryById: async (entryId: string) => {
    const { data } = await apiClient.entries.$get({
      query: {
        id: entryId,
      },
    })
    if (data) {
      get().upsertMany([
        // patch data, should omit `read` because the network race condition or server cache
        omit(data, "read") as any,
      ])
    }
    return data
  },
  fetchEntries: async ({
    level,
    id,
    view,
    read,

    pageParam,
  }) => {
    const data = await apiClient.entries.$post({
      json: {
        publishedAfter: pageParam as string,
        read,
        // withContent: true,
        ...getEntriesParams({
          level,
          id,
          view,
        }),
      },
    })

    if (data.data) {
      get().upsertMany(data.data)
    }
    return data
  },

  getFlattenMapEntries() {
    return get().flatMapEntries
  },
  optimisticUpdate(entryId: string, changed: Partial<EntryModel>) {
    set((state) =>
      produce(state, (draft) => {
        const entry = draft.flatMapEntries[entryId]
        if (!entry) return
        Object.assign(entry, changed)
        return draft
      }),
    )
  },
  optimisticUpdateManyByFeedId(feedId, changed) {
    set((state) =>
      produce(state, (draft) => {
        const ids = draft.entries[feedId]
        if (!ids) return

        ids.forEach((entryId) => {
          Object.assign(draft.flatMapEntries[entryId], changed)
        })

        return draft
      }),
    )
  },
  optimisticUpdateAll(changed) {
    set((state) =>
      produce(state, (draft) => {
        for (const entry of Object.values(draft.flatMapEntries)) {
          Object.assign(entry, changed)
        }
        return draft
      }),
    )
  },

  upsertMany(entries) {
    set((state) =>
      produce(state, (draft) => {
        for (const entry of entries) {
          if (!draft.entries[entry.feeds.id]) {
            draft.entries[entry.feeds.id] = []
          }

          if (!draft.internal_feedId2entryIdSet[entry.feeds.id]) {
            draft.internal_feedId2entryIdSet[entry.feeds.id] = new Set()
          }

          if (
            !draft.internal_feedId2entryIdSet[entry.feeds.id].has(
              entry.entries.id,
            )
          ) {
            draft.entries[entry.feeds.id].push(entry.entries.id)
            draft.internal_feedId2entryIdSet[entry.feeds.id].add(
              entry.entries.id,
            )
          }

          draft.flatMapEntries[entry.entries.id] = merge(
            draft.flatMapEntries[entry.entries.id] || {},
            entry,
          )
        }
        return draft
      }),
    )
  },

  markRead: (feedId: string, entryId: string, read: boolean) => {
    unreadActions.incrementByFeedId(feedId, read ? -1 : 1)
    entryActions.optimisticUpdate(entryId, {
      read,
    })
  },
  markReadByFeedId: (feedId: string) => {
    const state = get()
    const entries = state.entries[feedId] || []
    entries.forEach((entryId) => {
      entryActions.markRead(feedId, entryId, true)
    })
    unreadActions.updateByFeedId(feedId, 0)
  },
}))

export const entryActions = getStoreActions(useEntryStore)

interface EntryFilter {
  unread?: boolean
}
export const useEntry = (entryId: string) =>
  useEntryStore((state) => state.flatMapEntries[entryId])
// feedId: single feedId, multiple feedId joint by `,`, and `collections`
export const useEntryIdsByFeedId = (feedId: string, filter?: EntryFilter) =>
  useEntryStore((state) => {
    const isMultiple = typeof feedId === "string" && feedId.includes(",")

    if (isMultiple) {
      const feedIds = feedId.split(",")
      const result = [] as string[]
      for (const id of feedIds) {
        result.push(...getSingle(id))
      }
      return result
    } else if (feedId === FEED_COLLECTION_LIST) {
      // TODO we can't filter collections in local mode by view
      return []
    } else {
      return getSingle(feedId)
    }

    function getSingle(feedId: string) {
      const data = state.entries[feedId] || []
      if (filter?.unread) {
        const result = [] as string[]
        for (const entryId of data) {
          const entry = state.flatMapEntries[entryId]
          if (!entry?.read) {
            result.push(entryId)
          }
        }
        return result
      }
      return data
    }
  })

export const useEntryIdsByView = (view: FeedViewType, filter?: EntryFilter) => {
  const feedIds = useFeedIdByView(view)
  return useEntryStore((state) => {
    const data = [] as string[]
    for (const feedId of feedIds) {
      const entries = state.entries[feedId] || []

      data.push(...entries)
    }

    if (filter?.unread) {
      const result = [] as string[]
      for (const entryId of data) {
        const entry = state.flatMapEntries[entryId]
        if (!entry?.read) {
          result.push(entryId)
        }
      }
      return result
    }
    return data
  })
}

export const useEntryIdsByFeedIdOrView = (
  feedIdOrView: string | FeedViewType,
  filter: EntryFilter = {},
) => {
  const byView = useEntryIdsByView(feedIdOrView as FeedViewType, filter)
  const byId = useEntryIdsByFeedId(feedIdOrView as string, filter)

  if (typeof feedIdOrView === "string") {
    return byId
  }
  return byView
}
