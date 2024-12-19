import { sql } from "drizzle-orm"

import { db } from "../database"
import { subscriptionsTable } from "../database/schemas"
import type { SubscriptionModel } from "../database/schemas/types"
import { subscriptionActions } from "../store/subscription/store"
import type { Hydratable } from "./base"

class SubscriptionServiceStatic implements Hydratable {
  async upsertMany(subscriptions: SubscriptionModel[]) {
    await db
      .insert(subscriptionsTable)
      .values(subscriptions)
      .onConflictDoUpdate({
        target: [subscriptionsTable.userId, subscriptionsTable.feedId],
        set: {
          category: sql`excluded.category`,
          createdAt: sql`excluded.created_at`,
          feedId: sql`excluded.feed_id`,
          isPrivate: sql`excluded.is_private`,
          title: sql`excluded.title`,
          userId: sql`excluded.user_id`,
          view: sql`excluded.view`,
        },
      })
  }
  async hydrate() {
    const subscriptions = await db.query.subscriptionsTable.findMany()
    subscriptionActions.upsertMany(subscriptions)
  }
}
export const SubscriptionService = new SubscriptionServiceStatic()