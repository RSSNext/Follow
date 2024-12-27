import type { SubscriptionSchema } from "../database/schemas/types"
import type { SubscriptionModel } from "../store/subscription/store"

class DbStoreMorph {
  toSubscriptionModel(subscription: SubscriptionSchema): SubscriptionModel {
    return {
      ...subscription,
      isPrivate: subscription.isPrivate ? true : false,
    }
  }
}

export const dbStoreMorph = new DbStoreMorph()
