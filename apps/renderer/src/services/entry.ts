import { browserDB } from "~/database"
import { appLog } from "~/lib/log"
import type { EntryModel } from "~/models/types"
import type { FlatEntryModel } from "~/store/entry"
import { entryActions, useEntryStore } from "~/store/entry"

import { BaseService } from "./base"
import { CleanerService } from "./cleaner"
import { EntryRelatedKey, EntryRelatedService } from "./entry-related"
import type { Hydable } from "./interface"

type EntryCollection = {
  createdAt: string
}
class EntryServiceStatic extends BaseService<EntryModel> implements Hydable {
  constructor() {
    super(browserDB.entries)
  }

  // @ts-expect-error
  override async upsertMany(data: EntryModel[], entryFeedMap: Record<string, string>) {
    const renewList = [] as { type: "entry"; id: string }[]
    const nextData = [] as (EntryModel & { feedId: string })[]

    for (const item of data) {
      const feedId = entryFeedMap[item.id]
      if (!feedId) {
        console.error("EntryService.upsertMany: feedId not found", item)
        continue
      }
      renewList.push({ type: "entry", id: item.id })
      nextData.push({
        ...item,
        feedId,
      })
    }

    CleanerService.reset(renewList)

    return super.upsertMany(nextData)
  }

  // @ts-ignore
  override async upsert(feedId: string, data: EntryModel): Promise<unknown> {
    CleanerService.reset([
      {
        type: "entry",
        id: data.id,
      },
    ])
    return super.upsert({
      ...data,
      // @ts-expect-error
      feedId,
    })
  }

  async bulkPatch(data: { key: string; changes: Partial<EntryModel> }[]) {
    await this.table.bulkUpdate(data)
    CleanerService.reset(data.map((d) => ({ type: "entry", id: d.key })))
  }

  override async findAll() {
    return super.findAll() as Promise<(EntryModel & { feedId: string })[]>
  }

  bulkStoreReadStatus(record: Record<string, boolean>) {
    return EntryRelatedService.upsert(EntryRelatedKey.READ, record)
  }

  async bulkStoreCollection(record: Record<string, EntryCollection>) {
    return EntryRelatedService.upsert(EntryRelatedKey.COLLECTION, record)
  }

  async deleteCollection(entryId: string) {
    return EntryRelatedService.deleteItems(EntryRelatedKey.COLLECTION, [entryId])
  }

  async deleteEntries(entryIds: string[]) {
    await Promise.all([
      this.table.bulkDelete(entryIds),
      EntryRelatedService.deleteItems(EntryRelatedKey.READ, entryIds),
      EntryRelatedService.deleteItems(EntryRelatedKey.COLLECTION, entryIds),
      CleanerService.cleanRefById(entryIds),
    ])
  }

  async deleteEntriesByFeedIds(feedIds: string[]) {
    const deleteEntryIds = await this.table.where("feedId").anyOf(feedIds).primaryKeys()
    await Promise.all([
      this.table.where("feedId").anyOf(feedIds).delete(),
      EntryRelatedService.deleteItems(EntryRelatedKey.READ, deleteEntryIds),
      EntryRelatedService.deleteItems(EntryRelatedKey.COLLECTION, deleteEntryIds),
    ])
  }

  async hydrate() {
    const [entries, entryRelated, feedEntries, collections] = await Promise.all([
      EntryService.findAll(),

      EntryRelatedService.findAll(EntryRelatedKey.READ),
      EntryRelatedService.findAll(EntryRelatedKey.FEED_ID),
      EntryRelatedService.findAll(EntryRelatedKey.COLLECTION),
    ])

    const storeValue = [] as FlatEntryModel[]
    const dirtyEntryIds = [] as string[]
    for (const entry of entries) {
      const entryRelatedFeedId = entry.feedId || feedEntries[entry.id]
      if (!entryRelatedFeedId) {
        appLog(`[Data hydrate warning]: Entry ${entry.id} has no related feed id`)
        dirtyEntryIds.push(entry.id)
        continue
      }

      storeValue.push({
        entries: entry,
        feedId: entryRelatedFeedId,
        read: entryRelated[entry.id] || false,
        collections: collections[entry.id] as {
          createdAt: string
        },
      })
    }
    entryActions.hydrate(storeValue)
    useEntryStore.setState({
      starIds: new Set(Object.keys(collections)),
    })

    if (dirtyEntryIds.length > 0) {
      // Remove entries that have no related feed id
      EntryService.deleteEntries(dirtyEntryIds)
      appLog(
        `[Data hydrate warning]: Entry ${dirtyEntryIds.join(", ")} has no related feed id, cleanup..`,
      )
    }
  }
}

export const EntryService = new EntryServiceStatic()
