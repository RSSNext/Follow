import { apiClient } from "@renderer/lib/api-fetch"
import { getEntriesParams } from "@renderer/lib/utils"
import type {
  EntryModel,
  FeedModel,
} from "@renderer/models"
import { EntryService, FeedEntryService } from "@renderer/services"
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
  patch(entryId, changed) {
    set((state) =>
      produce(state, (draft) => {
        const entry = draft.flatMapEntries[entryId]
        if (!entry) return
        Object.assign(entry, changed)
        return draft
      }),
    )
  },
  patchManyByFeedId(feedId, changed) {
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
  patchAll(changed) {
    set((state) =>
      produce(state, (draft) => {
        for (const entry of Object.values(draft.flatMapEntries)) {
          Object.assign(entry, changed)
        }
        return draft
      }),
    )
  },

  upsertMany(data) {
    const feeds = [] as FeedModel[]
    const entries = [] as EntryModel[]
    const entry2Read = {} as Record<string, boolean>
    set((state) =>
      produce(state, (draft) => {
        for (const item of data) {
          if (!draft.entries[item.feeds.id]) {
            draft.entries[item.feeds.id] = []
          }

          if (!draft.internal_feedId2entryIdSet[item.feeds.id]) {
            draft.internal_feedId2entryIdSet[item.feeds.id] = new Set()
          }

          if (
            !draft.internal_feedId2entryIdSet[item.feeds.id].has(
              item.entries.id,
            )
          ) {
            draft.entries[item.feeds.id].push(item.entries.id)
            draft.internal_feedId2entryIdSet[item.feeds.id].add(
              item.entries.id,
            )
          }

          draft.flatMapEntries[item.entries.id] = merge(
            draft.flatMapEntries[item.entries.id] || {},
            item,
          )

          // Push feed
          feeds.push(item.feeds)
          // Push entry
          entries.push(item.entries)
          // Push entry2Read
          entry2Read[item.entries.id] = item.read || false
        }

        return draft
      }),
    )
    // Insert to feed store
    feedActions.upsertMany(feeds)
    EntryService.upsertMany(entries)
    EntryService.bulkUpdateReadStatus(entry2Read)
    const newEntries = get().entries
    for (const feedId in newEntries) {
      FeedEntryService.updateFeed(feedId, newEntries[feedId])
    }
  },

  markRead: (feedId: string, entryId: string, read: boolean) => {
    unreadActions.incrementByFeedId(feedId, read ? -1 : 1)
    entryActions.patch(entryId, {
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
