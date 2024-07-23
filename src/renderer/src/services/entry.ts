import { entryModel } from "@renderer/database/models"
import type { EntryModel } from "@renderer/models/types"

import { BaseService } from "./base"
import { EntryRelatedKey, EntryRelatedService } from "./entry-related"

type EntryCollection = {
  createdAt: string
}
class EntryServiceStatic extends BaseService<EntryModel> {
  constructor() {
    super(entryModel.table)
  }

  // @ts-expect-error
  override async upsertMany(
    data: EntryModel[],
    entryFeedMap: Record<string, string>,
  ) {
    const nextData = data.map((item) => ({
      ...item,
      feedId: entryFeedMap[item.id],
    }))

    return super.upsertMany(nextData)
  }

  // @ts-ignore
  override async upsert(feedId: string, data: EntryModel): Promise<unknown> {
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

  /** @deprecated */
  bulkStoreFeedId(record: Record<string, string>) {
    return EntryRelatedService.upsert(EntryRelatedKey.FEED_ID, record)
  }

  async bulkStoreCollection(record: Record<string, EntryCollection>) {
    return EntryRelatedService.upsert(EntryRelatedKey.COLLECTION, record)
  }

  async deleteCollection(entryId: string) {
    return EntryRelatedService.deleteItem(EntryRelatedKey.COLLECTION, entryId)
  }

  async deleteEntries(entryIds: string[]) {
    await entryModel.table.bulkDelete(entryIds)
  }

  async deleteEntriesByFeedId(feedIds: string[]) {
    await entryModel.table.where("feedId").anyOf(feedIds).delete()
  }
}

export const EntryService = new EntryServiceStatic()
