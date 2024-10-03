import type { EntryReadHistoriesModel } from "@follow/shared/hono"
import { produce } from "immer"
import { isNil, merge, omit } from "lodash-es"

import { runTransactionInScope } from "~/database"
import { apiClient } from "~/lib/api-fetch"
import { getEntriesParams, omitObjectUndefinedValue } from "~/lib/utils"
import type { CombinedEntryModel, EntryModel, FeedModel, FeedOrListRespModel } from "~/models"
import { EntryService } from "~/services"

import { feedActions } from "../feed"
import { imageActions } from "../image"
import { inboxActions } from "../inbox"
import { feedUnreadActions } from "../unread"
import { createZustandStore, doMutationAndTransaction } from "../utils/helper"
import { internal_batchMarkRead } from "./helper"
import type { EntryState, FlatEntryModel } from "./types"

const createState = (): EntryState => ({
  entries: {},
  flatMapEntries: {},
  internal_feedId2entryIdSet: {},
  starIds: new Set(),
  readHistory: {},
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
    const entryIds = get().entries[feedId]

    if (!entryIds) return
    set((state) =>
      produce(state, (draft) => {
        entryIds.forEach((entryId) => {
          delete draft.flatMapEntries[entryId]
        })
        delete draft.entries[feedId]
        delete draft.internal_feedId2entryIdSet[feedId]
      }),
    )
    runTransactionInScope(() => EntryService.deleteEntries(entryIds))
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
      feedActions.upsertMany([data.feeds])
    }

    return data
  }

  async fetchInboxEntryById(entryId: string) {
    const { data } = await apiClient.entries.inbox.$get({
      query: {
        id: entryId,
      },
    })
    if (data) {
      this.upsertMany([
        // patch data, should omit `read` because the network race condition or server cache
        omit(data, "read") as any,
      ])
      inboxActions.upsertMany([data.feeds])
    }

    return data
  }

  async fetchEntries({
    feedId,
    inboxId,
    listId,
    view,
    read,
    limit,
    pageParam,
    isArchived,
  }: {
    feedId?: number | string
    inboxId?: number | string
    listId?: number | string
    view?: number
    read?: boolean
    limit?: number
    pageParam?: string
    isArchived?: boolean
  }) {
    const data = inboxId
      ? await apiClient.entries.inbox.$post({
          json: {
            publishedAfter: pageParam,
            limit,
            inboxId: `${inboxId}`,
          },
        })
      : await apiClient.entries.$post({
          json: {
            publishedAfter: pageParam,
            read,
            limit,
            isArchived,
            // withContent: true,
            ...getEntriesParams({
              feedId,
              inboxId,
              listId,
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

  private patch(entryId: string, changed: Partial<CombinedEntryModel>) {
    set((state) =>
      produce(state, (draft) => {
        const entry = draft.flatMapEntries[entryId]
        if (!entry) return
        Object.assign(entry, omitObjectUndefinedValue(changed))

        return draft
      }),
    )
  }

  patchManyByFeedId(
    feedId: string,
    changed: Partial<CombinedEntryModel>,
    filter?: {
      startTime: number
      endTime: number
    },
  ) {
    const patchChangedEntriesInDb = [] as {
      key: string
      changes: Partial<EntryModel>
    }[]

    const changedReadStatusMap = {} as Record<string, boolean>

    // TODO collection patch in db

    set((state) =>
      produce(state, (draft) => {
        const ids = draft.entries[feedId]
        if (!ids) return

        ids.forEach((entryId) => {
          if (filter) {
            const entry = draft.flatMapEntries[entryId]
            if (
              +new Date(entry.entries.publishedAt) < filter.startTime ||
              +new Date(entry.entries.publishedAt) > filter.endTime
            ) {
              return
            }
          }
          Object.assign(draft.flatMapEntries[entryId], changed)

          if (changed.entries) {
            patchChangedEntriesInDb.push({
              key: entryId,
              changes: changed.entries,
            })
          }

          if (!isNil(changed.read)) {
            // EntryService.bulkStoreReadStatus()
            changedReadStatusMap[entryId] = changed.read
          }
        })

        return draft
      }),
    )
    runTransactionInScope(() => {
      if (patchChangedEntriesInDb.length > 0) {
        EntryService.bulkPatch(patchChangedEntriesInDb)
      }

      EntryService.bulkStoreReadStatus(changedReadStatusMap)
    })
  }

  upsertMany(data: CombinedEntryModel[]) {
    const feeds = [] as FeedOrListRespModel[]
    const entries = [] as EntryModel[]
    const entry2Read = {} as Record<string, boolean>
    const entryFeedMap = {} as Record<string, string>
    const entryCollection = {} as Record<string, any>

    set((state) =>
      produce(state, (draft) => {
        for (const item of data) {
          const mergedEntry = Object.assign(
            {},
            state.flatMapEntries[item.entries.id]?.entries || {},
            item.entries,
          )

          if (!draft.entries[item.feeds.id]) {
            draft.entries[item.feeds.id] = []
          }

          if (!draft.internal_feedId2entryIdSet[item.feeds.id]) {
            draft.internal_feedId2entryIdSet[item.feeds.id] = new Set()
          }

          if (!draft.internal_feedId2entryIdSet[item.feeds.id].has(item.entries.id)) {
            draft.entries[item.feeds.id].push(item.entries.id)
            draft.internal_feedId2entryIdSet[item.feeds.id].add(item.entries.id)
          }

          draft.flatMapEntries[item.entries.id] = merge(
            draft.flatMapEntries[item.entries.id] || {},
            {
              feedId: item.feeds.id,
              entries: mergedEntry,
            },
            omit(item, "feeds"),
          )

          // Push feed
          feeds.push(item.feeds)
          // Push entry
          entries.push(mergedEntry)
          // Push entry2Read
          if (!isNil(item.read)) {
            entry2Read[item.entries.id] = item.read
          }
          // Push entryFeedMap
          entryFeedMap[item.entries.id] = item.feeds.id
          // Push entryCollection
          if ("collections" in item) {
            entryCollection[item.entries.id] = item.collections
          }

          if (item.entries.media) {
            for (const media of item.entries.media) {
              if (!media.height || !media.width) continue
              imageActions.saveImages([
                {
                  src: media.url,
                  width: media.width,
                  height: media.height,
                  ratio: media.width / media.height,
                },
              ])
            }
          }
        }

        return draft
      }),
    )
    // Insert to feed store
    feedActions.upsertMany(feeds as FeedModel[])
    const newStarIds = new Set(get().starIds)
    for (const entryId in entryCollection) {
      newStarIds.add(entryId)
    }
    set((state) => ({
      ...state,
      starIds: newStarIds,
    }))

    // Update database
    runTransactionInScope(() =>
      Promise.all([
        EntryService.upsertMany(entries, entryFeedMap),
        EntryService.bulkStoreReadStatus(entry2Read),
        EntryService.bulkStoreCollection(entryCollection),
      ]),
    )
  }

  hydrate(data: FlatEntryModel[]) {
    const entryCollection = {} as Record<string, any>

    set((state) =>
      produce(state, (draft) => {
        for (const item of data) {
          if (!draft.entries[item.feedId]) {
            draft.entries[item.feedId] = []
          }

          if (!draft.internal_feedId2entryIdSet[item.feedId]) {
            draft.internal_feedId2entryIdSet[item.feedId] = new Set()
          }

          if (!draft.internal_feedId2entryIdSet[item.feedId].has(item.entries.id)) {
            draft.entries[item.feedId].push(item.entries.id)
            draft.internal_feedId2entryIdSet[item.feedId].add(item.entries.id)
          }

          draft.flatMapEntries[item.entries.id] = merge(
            draft.flatMapEntries[item.entries.id] || {},
            item,
          )

          // Push entryCollection
          if ("collections" in item) {
            entryCollection[item.entries.id] = item.collections
          }
        }

        return draft
      }),
    )

    const newStarIds = new Set(get().starIds)
    for (const entryId in entryCollection) {
      newStarIds.add(entryId)
    }
    set((state) => ({
      ...state,
      starIds: newStarIds,
    }))
  }

  async markRead({ feedId, entryId, read }: { feedId: string; entryId: string; read: boolean }) {
    const entry = get().flatMapEntries[entryId]
    const isInbox = entry?.entries && "inboxHandle" in entry.entries

    if (read && entry?.read) {
      return
    }

    feedUnreadActions.incrementByFeedId(feedId, read ? -1 : 1)

    this.patch(entryId, {
      read,
    })

    await doMutationAndTransaction(
      // Send api request
      async () => {
        if (read) {
          await internal_batchMarkRead([feedId, entryId, isInbox])
        } else {
          await apiClient.reads.$delete({
            json: {
              entryId,
              isInbox,
            },
          })
        }
      },
      async () =>
        EntryService.bulkStoreReadStatus({
          [entryId]: read,
        }),
    )
  }

  async markStar(entryId: string, star: boolean) {
    this.patch(entryId, {
      collections: star
        ? {
            createdAt: new Date().toISOString(),
          }
        : (null as unknown as undefined),
    })

    set((state) =>
      produce(state, (state) => {
        star ? state.starIds.add(entryId) : state.starIds.delete(entryId)
      }),
    )

    await doMutationAndTransaction(
      // Send api request
      async () => {
        if (star) {
          apiClient.collections.$post({
            json: {
              entryId,
            },
          })
        } else {
          await apiClient.collections.$delete({
            json: {
              entryId,
            },
          })
        }
      },
      async () => {
        if (star) {
          return EntryService.bulkStoreCollection({
            [entryId]: {
              createdAt: new Date().toISOString(),
            },
          })
        } else {
          return EntryService.deleteCollection(entryId)
        }
      },
    )
  }

  updateReadHistory(entryId: string, readHistory: Omit<EntryReadHistoriesModel, "entryId">) {
    set((state) => ({
      ...state,
      readHistory: {
        ...state.readHistory,
        [entryId]: readHistory,
      },
    }))
  }
}

export const entryActions = new EntryActions()

export const getEntry = (entryId: string) => useEntryStore.getState().flatMapEntries[entryId]
