import { subscriptionModel } from "@renderer/database"
import type { SubscriptionPlainModel } from "@renderer/store"

import { BaseService } from "./base"

type SubscriptionModelWithId = SubscriptionPlainModel & { id: string }

class SubscriptionServiceStatic extends BaseService<SubscriptionModelWithId> {
  constructor() {
    super(subscriptionModel.table)
  }

  override async upsertMany(data: SubscriptionPlainModel[]) {
    this.table.bulkPut(
      data.map((d) => ({ ...d, id: this.uniqueId(d.userId, d.feedId) })),
    )
  }

  override upsert(data: SubscriptionModelWithId) {
    this.table.put({
      ...data,
      id: this.uniqueId(data.userId, data.feedId),
    })
  }

  private uniqueId(userId: string, feedId: string) {
    return `${userId}/${feedId}`
  }
}

export const SubscriptionService = new SubscriptionServiceStatic()
