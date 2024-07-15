import { entryModel } from "@renderer/database/models"
import type {
  EntryModel,
} from "@renderer/models/types"

import { BaseService } from "./base"
import { EntryRelatedKey, EntryRelatedService } from "./entry-related"

type EntryCollection = {
  createdAt: string
}
class EntryServiceStatic extends BaseService<EntryModel> {
  constructor() {
    super(entryModel.table)
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
