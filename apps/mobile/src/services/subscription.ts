import { db } from "../database"
import { subscriptionsTable } from "../database/schemas"
import type { SubscriptionModel } from "../database/schemas/types"
import { subscriptionActions } from "../store/subscription/store"
import type { Hydratable } from "./base"

class SubscriptionServiceStatic implements Hydratable {
  async upsertMany(subscriptions: SubscriptionModel[]) {
    await db.insert(subscriptionsTable).values(subscriptions)
  }
  async hydrate() {
    const subscriptions = await db.query.subscriptionsTable.findMany()
    subscriptionActions.upsertMany(subscriptions)
  }
}
export const SubscriptionService = new SubscriptionServiceStatic()
