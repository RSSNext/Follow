import { FeedViewType } from "@follow/constants"

import { apiClient } from "@/src/lib/api-fetch"
import { honoMorph } from "@/src/morph/hono"
import { storeDbMorph } from "@/src/morph/store-db"
import { EntryService } from "@/src/services/entry"

import { createImmerSetter, createTransaction, createZustandStore } from "../internal/helper"
import { listActions } from "../list/store"
import { getSubscription } from "../subscription/getter"
import type { EntryModel, FetchEntriesProps } from "./types"
import { getEntriesParams } from "./utils"

type EntryId = string
type FeedId = string
type InboxId = string
type Category = string

interface EntryState {
  data: Record<EntryId, EntryModel>
  entryIdByView: Record<FeedViewType, Set<EntryId>>
  entryIdByCategory: Record<Category, Set<EntryId>>
  entryIdByFeed: Record<FeedId, Set<EntryId>>
  entryIdByInbox: Record<InboxId, Set<EntryId>>
}

const defaultState: EntryState = {
  data: {},
  entryIdByView: {
    [FeedViewType.Articles]: new Set(),
    [FeedViewType.Audios]: new Set(),
    [FeedViewType.Notifications]: new Set(),
    [FeedViewType.Pictures]: new Set(),
    [FeedViewType.SocialMedia]: new Set(),
    [FeedViewType.Videos]: new Set(),
  },
  entryIdByCategory: {},
  entryIdByFeed: {},
  entryIdByInbox: {},
}

export const useEntryStore = createZustandStore<EntryState>("entry")(() => defaultState)

const set = useEntryStore.setState
const immerSet = createImmerSetter(useEntryStore)

class EntryActions {
  upsertManyInSession(entries: EntryModel[]) {
    if (entries.length === 0) return

    immerSet((draft) => {
      for (const entry of entries) {
        draft.data[entry.id] = entry

        const { feedId, inboxHandle } = entry
        if (feedId) {
          let entryIdSetByFeed = draft.entryIdByFeed[feedId]
          if (!entryIdSetByFeed) {
            entryIdSetByFeed = new Set<EntryId>()
            draft.entryIdByFeed[feedId] = entryIdSetByFeed
          }
          entryIdSetByFeed.add(entry.id)

          const subscription = getSubscription(feedId)
          if (subscription?.view) {
            draft.entryIdByView[subscription.view].add(entry.id)
          }

          if (subscription?.category) {
            let entryIdSetByCategory = draft.entryIdByCategory[subscription.category]
            if (!entryIdSetByCategory) {
              entryIdSetByCategory = new Set<EntryId>()
              draft.entryIdByCategory[subscription.category] = entryIdSetByCategory
            }
            entryIdSetByCategory.add(entry.id)
          }
        }

        if (inboxHandle) {
          let entryIdSetByInbox = draft.entryIdByInbox[inboxHandle]
          if (!entryIdSetByInbox) {
            entryIdSetByInbox = new Set<EntryId>()
            draft.entryIdByInbox[inboxHandle] = entryIdSetByInbox
          }
          entryIdSetByInbox.add(entry.id)
        }
      }
    })
  }

  async upsertMany(entries: EntryModel[]) {
    const tx = createTransaction()
    tx.store(() => {
      this.upsertManyInSession(entries)
    })

    tx.persist(() => {
      return EntryService.upsertMany(entries.map((e) => storeDbMorph.toEntrySchema(e)))
    })

    await tx.run()
  }

  reset() {
    set(defaultState)
  }
}

class EntrySyncServices {
  async fetchEntries(props: FetchEntriesProps) {
    const { feedId, inboxId, listId, view, read, limit, pageParam, isArchived } = props
    const params = getEntriesParams({
      feedId,
      inboxId,
      listId,
      view,
    })
    const res = await apiClient.entries.$post({
      json: {
        publishedAfter: pageParam,
        read,
        limit,
        isArchived,
        ...params,
      },
    })

    const entries = honoMorph.toEntry(res.data)
    await entryActions.upsertMany(entries)
    if (params.listId) {
      await listActions.addEntryIds({
        listId: params.listId,
        entryIds: entries.map((e) => e.id),
      })
    }
    return entries
  }
}

export const entrySyncServices = new EntrySyncServices()
export const entryActions = new EntryActions()
