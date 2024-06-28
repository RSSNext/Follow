import { useEntryStore } from "../entry"
import { useFeedStore } from "../feed"
import { useSubscriptionStore } from "../subscription"

export const getEntryIsInView = (entryId: string) => {
  const state = useEntryStore.getState()
  const entry = state.flatMapEntries[entryId]
  if (!entry) return
  const feedId = entry.feeds.id
  const feed = useFeedStore.getState().feeds[feedId]
  if (!feed?.id) return
  const subscription = useSubscriptionStore.getState().data[feed.id]
  if (!subscription) return
  return subscription.view
}
