import type { FeedModel, SubscriptionModel } from "../database/schemas/types"
import type { HonoApiClient } from "./types"

class Morph {
  toSubscription(data: HonoApiClient.Subscription_Get) {
    const subscriptions: SubscriptionModel[] = []

    // TODO list inbox
    const collections = {} as {
      feed: FeedModel | null
    }

    for (const item of data) {
      subscriptions.push({
        category: item.category!,
        feedId: item.feedId,
        userId: item.userId,
        view: item.view,
        isPrivate: item.isPrivate ? 1 : 0,
        title: item.title,
        createdAt: item.createdAt,
      })

      if ("feeds" in item) {
        const feed = item.feeds
        collections.feed = {
          description: feed.description!,
          id: feed.id,
          errorAt: feed.errorAt!,
          errorMessage: feed.errorMessage!,
          image: feed.image!,
          ownerUserId: feed.ownerUserId!,
          siteUrl: feed.siteUrl!,
          title: feed.title!,
          type: feed.type!,
          url: feed.url,
        }
      }
    }
    return { subscriptions, ...collections }
  }
}

export const morph = new Morph()
