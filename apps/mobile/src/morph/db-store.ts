import type { EntrySchema, SubscriptionSchema } from "../database/schemas/types"
import type { EntryModel } from "../store/entry/types"
import type { SubscriptionModel } from "../store/subscription/store"

class DbStoreMorph {
  toSubscriptionModel(subscription: SubscriptionSchema): SubscriptionModel {
    return {
      ...subscription,
      isPrivate: subscription.isPrivate ? true : false,
    }
  }

  toEntryModel(entry: EntrySchema): EntryModel {
    return entry
  }
}

export const dbStoreMorph = new DbStoreMorph()
