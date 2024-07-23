import { EntryService } from "./entry"
import { FeedService } from "./feed"
import { FeedUnreadService } from "./feed-unread"
import { SubscriptionService } from "./subscription"

class CleanerServiceStatic {
  // Clean other user subscriptions, should call this after login
  async cleanOtherUserSubscriptions(currentUserId: string) {
    const dbUserIds = await SubscriptionService.getUserIds()

    const otherUserIds = dbUserIds.filter((id) => id !== currentUserId)
    const remainingSubscriptions =
      await SubscriptionService.getUserSubscriptions(otherUserIds)
    const currentSubscription = await SubscriptionService.getUserSubscriptions([
      currentUserId,
    ])
    const currentSubscriptionFeedsSet = new Set(
      currentSubscription.map((s) => s.feedId),
    )
    // Finds a subscripion that does not exist for the current user, but a feedId that exists in the db

    const toRemoveSubscription = remainingSubscriptions.filter(
      (s) => !currentSubscriptionFeedsSet.has(s.feedId),
    )

    const toRemoveFeedIds = toRemoveSubscription.map((s) => s.feedId)
    await Promise.allSettled([
      otherUserIds.map((id) => SubscriptionService.removeSubscription(id)),
      FeedService.bulkDelete(toRemoveFeedIds),
      FeedUnreadService.bulkDelete(toRemoveFeedIds),
      EntryService.deleteEntriesByFeedId(toRemoveFeedIds),
    ])
  }
}
export const CleanerService = new CleanerServiceStatic()
