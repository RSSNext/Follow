import { apiClient } from "@renderer/lib/api-fetch"
import { getEntriesParams } from "@renderer/lib/utils"
import type { EntryModel, FeedModel } from "@renderer/models"
import { produce } from "immer"
import { merge, omit } from "lodash-es"

import { feedActions } from "../feed"
import { unreadActions } from "../unread"
import { createZustandStore, getStoreActions } from "../utils/helper"
import type { EntryActions, EntryState } from "./types"

export const useEntryStore = createZustandStore<EntryState & EntryActions>(
  "entry",
  {
    version: 1,
    disablePersist: true,
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
        const feeds = [] as FeedModel[]
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

          // Push feed
          feeds.push(entry.feeds)
        }

        // Insert to feed store
        feedActions.upsertMany(feeds)

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
