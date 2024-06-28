import { entryModel } from "@renderer/database/models"
import type {
  CombinedEntryModel,
  EntryModel,
  FeedModel,
} from "@renderer/models/types"

import { BaseService } from "./base"
import { EntryRelatedKey, EntryRelatedService } from "./entry-related"
import { FeedService } from "./feed"

type EntryCollection = {
  createdAt: string
}
class EntryServiceStatic extends BaseService<EntryModel> {
  constructor() {
    super(entryModel.table)
  }

  pour(data: CombinedEntryModel[]) {
    const entries = [] as EntryModel[]
    const feeds = [] as FeedModel[]
    for (const entry of data) {
      entries.push(entry.entries)

      feeds.push(entry.feeds)
    }

    return Promise.all([
      this.upsertMany(entries),
      FeedService.upsertMany(feeds),
    ])
  }

  bulkStoreReadStatus(record: Record<string, boolean>) {
    return EntryRelatedService.upsert(EntryRelatedKey.READ, record)
  }

  bulkStoreFeedId(record: Record<string, string>) {
    return EntryRelatedService.upsert(EntryRelatedKey.FEED_ID, record)
  }

  async bulkStoreCollection(record: Record<string, EntryCollection>) {
    return EntryRelatedService.upsert(EntryRelatedKey.COLLECTION, record)
  }

  async deleteCollection(entryId: string) {
    return EntryRelatedService.deleteItem(EntryRelatedKey.COLLECTION, entryId)
  }
}

export const EntryService = new EntryServiceStatic()
