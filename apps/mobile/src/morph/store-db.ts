import type { ListSchema, SubscriptionSchema } from "../database/schemas/types"
import type { ListModel } from "../store/list/store"
import type { SubscriptionModel } from "../store/subscription/store"

class StoreDbMorph {
  toListSchema(list: ListModel): ListSchema {
    return {
      ...list,
      feedIds: JSON.stringify(list.feedIds),
    }
  }
  toSubscriptionSchema(subscription: SubscriptionModel): SubscriptionSchema {
    return {
      ...subscription,
      id: buildId(subscription),
    }
  }
}

export const storeDbMorph = new StoreDbMorph()

const buildId = (subscription: SubscriptionModel) => {
  if (subscription.feedId) return `${subscription.type}/${subscription.feedId}`
  if (subscription.listId) return `${subscription.type}/${subscription.listId}`
  if (subscription.inboxId) return `${subscription.type}/${subscription.inboxId}`
  throw new Error("Invalid subscription")
}
