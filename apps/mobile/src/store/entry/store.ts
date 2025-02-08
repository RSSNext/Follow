import { FeedViewType } from "@follow/constants"
import { debounce } from "es-toolkit/compat"
import { fetch as expoFetch } from "expo/fetch"

import { apiClient } from "@/src/lib/api-fetch"
import { getCookie } from "@/src/lib/auth"
import { honoMorph } from "@/src/morph/hono"
import { storeDbMorph } from "@/src/morph/store-db"
import { EntryService } from "@/src/services/entry"

import { createImmerSetter, createTransaction, createZustandStore } from "../internal/helper"
import { listActions } from "../list/store"
import { getSubscription } from "../subscription/getter"
import { getEntry } from "./getter"
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
  private addEntryIdToFeed({
    draft,
    feedId,
    entryId,
  }: {
    draft: EntryState
    feedId?: FeedId | null
    entryId: EntryId
  }) {
    if (!feedId) return
    const entryIdSetByFeed = draft.entryIdByFeed[feedId]
    if (!entryIdSetByFeed) {
      draft.entryIdByFeed[feedId] = new Set([entryId])
    } else {
      entryIdSetByFeed.add(entryId)
    }

    const subscription = getSubscription(feedId)
    if (typeof subscription?.view === "number") {
      draft.entryIdByView[subscription.view].add(entryId)
    }
    if (subscription?.category) {
      const entryIdSetByCategory = draft.entryIdByCategory[subscription.category]
      if (!entryIdSetByCategory) {
        draft.entryIdByCategory[subscription.category] = new Set([entryId])
      } else {
        entryIdSetByCategory.add(entryId)
      }
    }
  }

  private addEntryIdToInbox({
    draft,
    inboxHandle,
    entryId,
  }: {
    draft: EntryState
    inboxHandle?: InboxId | null
    entryId: EntryId
  }) {
    if (!inboxHandle) return
    const entryIdSetByInbox = draft.entryIdByInbox[inboxHandle]
    if (!entryIdSetByInbox) {
      draft.entryIdByInbox[inboxHandle] = new Set([entryId])
    } else {
      entryIdSetByInbox.add(entryId)
    }
  }

  upsertManyInSession(entries: EntryModel[]) {
    if (entries.length === 0) return

    immerSet((draft) => {
      for (const entry of entries) {
        draft.data[entry.id] = entry

        const { feedId, inboxHandle } = entry
        this.addEntryIdToFeed({
          draft,
          feedId,
          entryId: entry.id,
        })

        this.addEntryIdToInbox({
          draft,
          inboxHandle,
          entryId: entry.id,
        })
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

  updateEntryContentInSession(entryId: EntryId, content: string) {
    immerSet((draft) => {
      const entry = draft.data[entryId]
      if (!entry) return
      entry.content = content
    })
  }

  async updateEntryContent(entryId: EntryId, content: string) {
    const tx = createTransaction()
    tx.store(() => {
      this.updateEntryContentInSession(entryId, content)
    })

    tx.persist(() => {
      return EntryService.patch({ id: entryId, content })
    })

    await tx.run()
  }

  reset(entries: EntryModel[] = []) {
    if (entries.length > 0) {
      immerSet((draft) => {
        // remove all entries from draft.data not in entries
        for (const existingEntry of Object.values(draft.data)) {
          if (!entries.some((e) => e.id === existingEntry.id)) {
            delete draft.data[existingEntry.id]
          }
        }
      })
    } else {
      set(defaultState)
    }
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

    const entries = honoMorph.toEntryList(res.data)
    const entriesInDB = await EntryService.getEntryMany(entries.map((e) => e.id))
    for (const entry of entries) {
      const entryContent = entriesInDB.find((e) => e.id === entry.id)
      if (entryContent) {
        entry.content = entryContent.content
      }
    }

    await entryActions.upsertMany(entries)
    if (params.listId) {
      await listActions.addEntryIds({
        listId: params.listId,
        entryIds: entries.map((e) => e.id),
      })
    }
    return entries
  }

  async fetchEntryContent(entryId: EntryId) {
    const res = await apiClient.entries.$get({ query: { id: entryId } })
    const entry = honoMorph.toEntry(res.data)
    if (!entry) return null
    if (entry.content && getEntry(entryId)?.content !== entry.content) {
      await entryActions.updateEntryContent(entryId, entry.content)
    }
    return entry
  }

  async fetchEntryContentByStream(remoteEntryIds?: string[]) {
    if (!remoteEntryIds || remoteEntryIds.length === 0) return

    const onlyNoStored = true

    const nextIds = [] as string[]
    if (onlyNoStored) {
      for (const id of remoteEntryIds) {
        const entry = getEntry(id)!
        if (entry.content) {
          continue
        }

        nextIds.push(id)
      }
    }

    if (nextIds.length === 0) return

    const readStream = async () => {
      // https://github.com/facebook/react-native/issues/37505
      // TODO: And it seems we can not just use fetch from expo for ofetch, need further investigation
      const response = await expoFetch(apiClient.entries.stream.$url().toString(), {
        method: "post",
        headers: {
          cookie: getCookie(),
        },
        body: JSON.stringify({
          ids: nextIds,
        }),
      })

      const reader = response.body?.getReader()
      if (!reader) return

      const decoder = new TextDecoder()
      let buffer = ""

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split("\n")

          // Process all complete lines
          for (let i = 0; i < lines.length - 1; i++) {
            if (lines[i]!.trim()) {
              const json = JSON.parse(lines[i]!)
              // Handle each JSON line here
              entryActions.updateEntryContent(json.id, json.content)
            }
          }

          // Keep the last incomplete line in the buffer
          buffer = lines.at(-1) || ""
        }

        // Process any remaining data
        if (buffer.trim()) {
          const json = JSON.parse(buffer)

          entryActions.updateEntryContent(json.id, json.content)
        }
      } catch (error) {
        console.error("Error reading stream:", error)
      } finally {
        reader.releaseLock()
      }
    }

    readStream()
  }
}

export const entrySyncServices = new EntrySyncServices()
export const entryActions = new EntryActions()
export const debouncedFetchEntryContentByStream = debounce(
  entrySyncServices.fetchEntryContentByStream,
  1000,
)
