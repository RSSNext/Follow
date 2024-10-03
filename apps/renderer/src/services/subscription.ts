import { uniq } from "lodash-es"

import { browserDB } from "~/database"
import type { SubscriptionFlatModel } from "~/store/subscription"
import { subscriptionActions } from "~/store/subscription"

import { BaseService } from "./base"
import type { Hydable } from "./interface"

type SubscriptionModelWithId = SubscriptionFlatModel & { id: string }

class SubscriptionServiceStatic extends BaseService<SubscriptionModelWithId> implements Hydable {
  constructor() {
    super(browserDB.subscriptions)
  }

  public getUserSubscriptions(userIds: string[]) {
    return this.table.where("userId").anyOf(userIds).toArray()
  }

  public async getUserIds() {
    return uniq(
      (await this.table
        .toCollection()
        .uniqueKeys()
        .then((keys) => keys.map((k) => k.toString().split("/")[0]))) as string[],
    )
  }

  override async upsertMany(data: SubscriptionFlatModel[]) {
    return this.table.bulkPut(
      data.map(({ feeds, lists, inboxes, ...d }: any) => ({
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

  async removeSubscription(userId: string, feedId: string): Promise<void>
  // @ts-expect-error
  async removeSubscription(userId: string): Promise<void>
  async removeSubscription(userId: string, feedId: string) {
    if (feedId && userId) {
      return this.table.delete(this.uniqueId(userId, feedId))
    }
    if (!feedId && userId) {
      return this.table.where("userId").equals(userId).delete()
    }
  }

  async renameCategory(userId: string, feedIdList: string[], category: string) {
    return this.table
      .where("userId")
      .equals(userId)
      .and((item) => feedIdList.includes(item.feedId))
      .modify({ category })
  }

  async hydrate() {
    const subscriptions = await SubscriptionService.findAll()

    subscriptionActions.upsertMany(subscriptions)
  }
}

export const SubscriptionService = new SubscriptionServiceStatic()
