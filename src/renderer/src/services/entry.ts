import { entryModel } from "@renderer/database/models"
import type {
  CombinedEntryModel,
  EntryModel,
  FeedModel,
} from "@renderer/models/types"

import { BaseService } from "./base"
import { EntryRelatedKey, EntryRelatedService } from "./entry-related"
import { FeedService } from "./feed"

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

  updateReadStatus(entryId: string, read: boolean) {
    return EntryRelatedService.upsert(
      EntryRelatedKey.READ,
      {
        [entryId]: read,
      },
    )
  }

  bulkUpdateReadStatus(record: Record<string, boolean>) {
    return EntryRelatedService.upsert(
      EntryRelatedKey.READ,
      record,
    )
  }

  recordFeedId(entryId: string, feedId: string) {
    return EntryRelatedService.upsert(
      EntryRelatedKey.FEED_ID,
      {
        [entryId]: feedId,
      },
    )
  }

  bulkRecordFeedId(record: Record<string, string>) {
    return EntryRelatedService.upsert(
      EntryRelatedKey.FEED_ID,
      record,
    )
  }
}

export const EntryService = new EntryServiceStatic()
