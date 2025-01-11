import { eq, sql } from "drizzle-orm"

import { db } from "../database"
import { feedsTable, inboxesTable, listsTable, subscriptionsTable } from "../database/schemas"
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

  async delete(subscription: SubscriptionSchema) {
    const { id } = subscription

    const result = await db.query.subscriptionsTable.findFirst({
      where: eq(subscriptionsTable.id, id),
      columns: {
        feedId: true,
        listId: true,
        type: true,
        inboxId: true,
      },
    })

    await db.delete(subscriptionsTable).where(eq(subscriptionsTable.id, id)).execute()

    if (!result) {
      return
    }

    // Cleanup
    const { type, feedId, listId, inboxId } = result
    switch (type) {
      case "feed": {
        if (!feedId) break
        await db.delete(feedsTable).where(eq(feedsTable.id, feedId)).execute()
        break
      }
      case "list": {
        if (!listId) break
        await db.delete(listsTable).where(eq(listsTable.id, listId)).execute()
        break
      }
      case "inbox": {
        if (!inboxId) break
        await db.delete(inboxesTable).where(eq(inboxesTable.id, inboxId)).execute()
        break
      }
    }
  }
}
export const SubscriptionService = new SubscriptionServiceStatic()
