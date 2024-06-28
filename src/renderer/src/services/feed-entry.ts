import { feedEntriesModel } from "@renderer/database"

class ServiceStatic {
  constructor() {}

  updateFeed(feedId: string, entryIds: string[]) {
    return feedEntriesModel.table.put({
      feedId,
      entryIds,
    })
  }

  getAll() {
    return feedEntriesModel.table.toArray()
  }
}
/**
 * Not used yet
 */
export const FeedEntryService = new ServiceStatic()
