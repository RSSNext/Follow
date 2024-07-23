import { feedUnreadModel } from "@renderer/database/models/unread"

class ServiceStatic {
  updateFeedUnread(list: [string, number][]) {
    return feedUnreadModel.table.bulkPut(
      list.map(([feedId, count]) => ({ id: feedId, count })),
    )
  }

  getAll() {
    return feedUnreadModel.table.toArray() as Promise<
      {
        id: string
        count: number
      }[]
    >
  }

  clear() {
    return feedUnreadModel.table.clear()
  }

  async bulkDelete(ids: string[]) {
    return feedUnreadModel.table.bulkDelete(ids)
  }
}

export const FeedUnreadService = new ServiceStatic()
