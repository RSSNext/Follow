import { eq, sql } from "drizzle-orm"

import { db } from "../database"
import { subscriptionsTable } from "../database/schemas"
import type { SubscriptionSchema } from "../database/schemas/types"
import { dbStoreMorph } from "../morph/db-store"
import { subscriptionActions } from "../store/subscription/store"
import type { Hydratable, Resetable } from "./internal/base"

class SubscriptionServiceStatic implements Hydratable, Resetable {
  async reset() {
    await db.delete(subscriptionsTable).execute()
  }
  async upsertMany(subscriptions: SubscriptionSchema[]) {
    if (subscriptions.length === 0) return
    await db
      .insert(subscriptionsTable)
      .values(subscriptions)
      .onConflictDoUpdate({
        target: [subscriptionsTable.id],
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

  async patch(subscription: Partial<SubscriptionSchema> & { id: string }) {
    await db
      .update(subscriptionsTable)
      .set(subscription)
      .where(eq(subscriptionsTable.id, subscription.id))
  }
  async hydrate() {
    const subscriptions = await db.query.subscriptionsTable.findMany()
    subscriptionActions.upsertManyInSession(
      subscriptions.map((s) => dbStoreMorph.toSubscriptionModel(s)),
    )
  }
}
export const SubscriptionService = new SubscriptionServiceStatic()
