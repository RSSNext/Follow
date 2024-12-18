import { db } from "../database"
import { feedsTable } from "../database/schemas"
import type { FeedModel } from "../database/schemas/types"
import { feedActions } from "../store/feed/store"
import type { Hydratable } from "./base"

class FeedServiceStatic implements Hydratable {
  async upsertMany(feed: FeedModel[]) {
    await db.transaction(async (tx) => {
      await tx.insert(feedsTable).values(feed)
    })
  }

  async hydrate() {
    const feeds = await db.query.feedsTable.findMany()
    feedActions.upsertMany(feeds)
  }
}

export const FeedService = new FeedServiceStatic()
