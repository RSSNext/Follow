import { entryModel } from "@renderer/database/models"
import type {
  CombinedEntryModel,
  EntryModel,
  FeedModel,
} from "@renderer/models/types"

import { BaseService } from "./base"
import { EntryReadService } from "./entry-read"
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
    return EntryReadService.upsert({
      id: entryId,
      read,
    })
  }

  bulkUpdateReadStatus(record: Record<string, boolean>) {
    const items = [] as { id: string, read: boolean }[]
    for (const [entryId, read] of Object.entries(record)) {
      items.push({ id: entryId, read })
    }
    return EntryReadService.upsertMany(items)
  }
}

export const EntryService = new EntryServiceStatic()
