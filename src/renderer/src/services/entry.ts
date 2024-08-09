import { browserDB } from "@renderer/database"
import type { EntryModel } from "@renderer/models/types"

import { BaseService } from "./base"
import { CleanerService } from "./cleaner"
import { EntryRelatedKey, EntryRelatedService } from "./entry-related"

type EntryCollection = {
  createdAt: string
}
class EntryServiceStatic extends BaseService<EntryModel> {
  constructor() {
    super(browserDB.entries)
  }

  // @ts-expect-error
  override async upsertMany(
    data: EntryModel[],
    entryFeedMap: Record<string, string>,
  ) {
    const renewList = [] as { type: "entry", id: string }[]
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

    CleanerService.renew(renewList)

    return super.upsertMany(nextData)
  }

  // @ts-ignore
  override async upsert(feedId: string, data: EntryModel): Promise<unknown> {
    CleanerService.renew([
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
    return EntryRelatedService.deleteItem(EntryRelatedKey.COLLECTION, entryId)
  }

  async deleteEntries(entryIds: string[]) {
    await this.table.bulkDelete(entryIds)
  }

  async deleteEntriesByFeedIds(feedIds: string[]) {
    await this.table.where("feedId").anyOf(feedIds).delete()
  }
}

export const EntryService = new EntryServiceStatic()
