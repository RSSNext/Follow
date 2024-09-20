import { browserDB } from "~/database"

const feedUnreadModel = browserDB.feedUnreads
class ServiceStatic {
  updateFeedUnread(list: [string, number][]) {
    return feedUnreadModel.bulkPut(list.map(([feedId, count]) => ({ id: feedId, count })))
  }

  getAll() {
    return feedUnreadModel.toArray() as Promise<
      {
        id: string
        count: number
      }[]
    >
  }

  clear() {
    return feedUnreadModel.clear()
  }

  async bulkDelete(ids: string[]) {
    return feedUnreadModel.bulkDelete(ids)
  }
}

export const FeedUnreadService = new ServiceStatic()
