import { apiClient } from "@renderer/lib/api-fetch"
import { getEntriesParams } from "@renderer/lib/utils"
import type { EntryModel } from "@renderer/models"
import { produce } from "immer"

import { unreadActions } from "./unread"
import { createZustandStore, getStoreActions } from "./utils/helper"

type FeedId = string
type EntryId = string
type EntriesIdTable = Record<FeedId, EntryId[]>

interface EntryState {
  entries: EntriesIdTable

  flatMapEntries: Record<string, EntryModel>
}

interface EntryActions {
  fetchEntries: (params: {
    level?: string
    id?: number | string
    view?: number
    read?: boolean

    pageParam?: string
  }) => Promise<Awaited<ReturnType<typeof apiClient.entries.$post>>>
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
}

export const useEntryStore = createZustandStore<EntryState & EntryActions>(
  "entry",
  {
    version: 0,
  },
)((set, get) => ({
  entries: {},
  flatMapEntries: {},

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
          draft.entries[entry.feeds.id].push(entry.entries.id)
          draft.flatMapEntries[entry.entries.id] = entry
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

export const useEntriesByFeedId = (feedId: string) =>
  useEntryStore((state) => {
    const entryIds = state.entries[feedId] || []
    return entryIds.map((id) => state.flatMapEntries[id])
  })
export const useEntry = (entryId: string) =>
  useEntryStore((state) => state.flatMapEntries[entryId])
