import { feedEntriesModel } from "@renderer/database"

class ServiceStatic {
  constructor() {}

  updateFeed(feedId: string, entryIds: string[]) {
    return feedEntriesModel.table.put({
      feedId,
      entryIds,
    })
  }
}

export const FeedEntryService = new ServiceStatic()
