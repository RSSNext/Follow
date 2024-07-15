import { apiClient } from "@renderer/lib/api-fetch"
import { getEntriesParams } from "@renderer/lib/utils"
import type {
  CombinedEntryModel,
  EntryModel,
  FeedModel,
} from "@renderer/models"
import { EntryService } from "@renderer/services"
import { produce } from "immer"
import { merge, omit } from "lodash-es"

import { isHydrated } from "../../initialize/hydrate"
import { feedActions } from "../feed"
import { feedUnreadActions } from "../unread"
import { createZustandStore } from "../utils/helper"
import type { EntryState } from "./types"

const createState = (): EntryState => ({
  entries: {},
  flatMapEntries: {},
  internal_feedId2entryIdSet: {},
  starIds: new Set(),
})

export const useEntryStore = createZustandStore<EntryState>("entry")(() => ({
  ...createState(),
}))

const get = useEntryStore.getState
const set = useEntryStore.setState
class EntryActions {
  clear() {
    set(createState)
  }

  clearByFeedId(feedId: string) {
    set((state) =>
      produce(state, (draft) => {
        const entryIds = draft.entries[feedId]
        if (!entryIds) return
        entryIds.forEach((entryId) => {
          delete draft.flatMapEntries[entryId]
        })
        delete draft.entries[feedId]
        delete draft.internal_feedId2entryIdSet[feedId]
      }),
    )
  }

  async fetchEntryById(entryId: string) {
    const { data } = await apiClient.entries.$get({
      query: {
        id: entryId,
      },
    })
    if (data) {
      this.upsertMany([
        // patch data, should omit `read` because the network race condition or server cache
        omit(data, "read") as any,
      ])
    }
    return data
  }

  async fetchEntries({
    level,
    id,
    view,
    read,

    pageParam,
  }) {
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
      this.upsertMany(data.data)
    }
    return data
  }

  getFlattenMapEntries() {
    return get().flatMapEntries
  }

  patch(entryId: string, changed: Partial<CombinedEntryModel>) {
    set((state) =>
      produce(state, (draft) => {
        const entry = draft.flatMapEntries[entryId]
        if (!entry) return
        Object.assign(entry, changed)
        if (changed.read !== undefined && changed.read !== null) {
          EntryService.bulkStoreReadStatus({
            [entryId]: changed.read,
          })
        }
        return draft
      }),
    )
  }

  patchManyByFeedId(feedId: string, changed: Partial<CombinedEntryModel>) {
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
  }

  patchAll(changed: Partial<CombinedEntryModel>) {
    set((state) =>
      produce(state, (draft) => {
        for (const entry of Object.values(draft.flatMapEntries)) {
          Object.assign(entry, changed)
        }
        return draft
      }),
    )
  }

  upsertMany(data: CombinedEntryModel[]) {
    const feeds = [] as FeedModel[]
    const entries = [] as EntryModel[]
    const entry2Read = {} as Record<string, boolean>
    const entryFeedMap = {} as Record<string, string>
    const entryCollection = {} as Record<string, any>
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
          // Push entryFeedMap
          entryFeedMap[item.entries.id] = item.feeds.id
          // Push entryCollection
          if (item.collections) {
            entryCollection[item.entries.id] = item.collections
          }
        }

        return draft
      }),
    )
    // Insert to feed store
    feedActions.upsertMany(feeds)
    const newStarIds = new Set(get().starIds)
    for (const entryId in entryCollection) {
      newStarIds.add(entryId)
    }
    set((state) => ({
      ...state,
      starIds: newStarIds,
    }))
    // Update database
    if (isHydrated()) {
      EntryService.upsertMany(entries)
      EntryService.bulkStoreReadStatus(entry2Read)
      EntryService.bulkStoreFeedId(entryFeedMap)
      EntryService.bulkStoreCollection(entryCollection)
    }
  }

  markRead(feedId: string, entryId: string, read: boolean) {
    feedUnreadActions.incrementByFeedId(feedId, read ? -1 : 1)
    this.patch(entryId, {
      read,
    })
  }

  markReadByFeedId(feedId: string) {
    const state = get()
    const entries = state.entries[feedId] || []
    entries.forEach((entryId) => {
      this.markRead(feedId, entryId, true)
    })
    feedUnreadActions.updateByFeedId(feedId, 0)
  }

  markStar(entryId: string, star: boolean) {
    this.patch(entryId, {
      collections: star ?
          {
            createdAt: new Date().toISOString(),
          } :
        undefined,
    })

    set((state) =>
      produce(state, (state) => {
        star ? state.starIds.add(entryId) : state.starIds.delete(entryId)
      }),
    )

    if (!isHydrated()) return
    if (star) {
      EntryService.bulkStoreCollection({
        [entryId]: {
          createdAt: new Date().toISOString(),
        },
      })
    } else {
      EntryService.deleteCollection(entryId)
    }
  }
}

export const entryActions = new EntryActions()

export const getEntry = (entryId: string) =>
  useEntryStore.getState().flatMapEntries[entryId]
