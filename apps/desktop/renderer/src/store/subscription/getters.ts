import { subscriptionCategoryExistSelector } from "./selector"
import { useSubscriptionStore } from "./store"

const get = useSubscriptionStore.getState
export const getSubscriptionByFeedId = (feedId: FeedId) => {
  const state = get()
  return state.data[feedId]
}

export const isListSubscription = (feedId?: FeedId) => {
  if (!feedId) return false
  const subscription = getSubscriptionByFeedId(feedId)
  if (!subscription) return false
  return "listId" in subscription && !!subscription.listId
}

export const subscriptionCategoryExist = (name: string) =>
  subscriptionCategoryExistSelector(name)(get())
