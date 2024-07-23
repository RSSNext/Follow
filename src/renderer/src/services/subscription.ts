import { subscriptionModel } from "@renderer/database"
import type { SubscriptionFlatModel } from "@renderer/store/subscription"

import { BaseService } from "./base"

type SubscriptionModelWithId = SubscriptionFlatModel & { id: string }

class SubscriptionServiceStatic extends BaseService<SubscriptionModelWithId> {
  constructor() {
    super(subscriptionModel.table)
  }

  override async upsertMany(data: SubscriptionFlatModel[]) {
    return this.table.bulkPut(
      data.map(({ feeds, ...d }: any) => ({
        ...d,
        id: this.uniqueId(d.userId, d.feedId),
      })),
    )
  }

  override upsert(data: SubscriptionFlatModel) {
    return this.table.put({
      ...data,
      id: this.uniqueId(data.userId, data.feedId),
    })
  }

  private uniqueId(userId: string, feedId: string) {
    return `${userId}/${feedId}`
  }

  async changeView(feedId: string, view: number) {
    return this.table.where("feedId").equals(feedId).modify({ view })
  }
}

export const SubscriptionService = new SubscriptionServiceStatic()
