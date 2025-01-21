import { FeedViewType } from "@follow/constants"

import { FEED_COLLECTION_LIST, ROUTE_FEED_IN_FOLDER } from "~/constants"

import type { useSubscriptionStore } from "./store"

type State = ReturnType<typeof useSubscriptionStore.getState>

export const subscriptionCategoryExistSelector = (name: string) => (state: State) =>
  state.categories.has(name)

export const feedSubscriptionCountSelector = (state: State) =>
  Object.values(state.data).filter(
    // FIXME: Backend data compatibility
    (s) => !!s.feedId && !s.listId && !s.inboxId && state.subscriptionIdSet.has(s.feedId),
  ).length

export const feedIdByViewSelector = (view: FeedViewType) => (state: State) =>
  state.feedIdByView[view]

export const categoryOpenStateByViewSelector = (view: FeedViewType) => (state: State) =>
  state.categoryOpenStateByView[view]

export const subscriptionByViewSelector = (view: FeedViewType) => (state: State) =>
  state.feedIdByView[view].map((id) => state.data[id])

export const subscriptionByFeedIdSelector = (feedId: string) => (state: State) => state.data[feedId]
export const subscriptionsByFeedIsdSelector = (feedIds: string[]) => (state: State) =>
  feedIds.map((id) => state.data[id])

export const folderFeedsByFeedIdSelector =
  ({ feedId, view }: { feedId?: string; view: FeedViewType }) =>
  (state: State): string[] | null => {
    if (typeof feedId !== "string") return null
    if (feedId === FEED_COLLECTION_LIST) {
      return [feedId]
    }

    if (!feedId.startsWith(ROUTE_FEED_IN_FOLDER)) {
      return null
    }

    const folderName = feedId.replace(ROUTE_FEED_IN_FOLDER, "")
    const feedIds: string[] = []
    for (const feedId in state.data) {
      const subscription = state.data[feedId]!
      if (
        subscription.view === view &&
        (subscription.category === folderName || subscription.defaultCategory === folderName)
      ) {
        feedIds.push(feedId)
      }
    }
    return feedIds
  }

export const listSubscriptionCountSelector = (state: State) =>
  Object.values(state.data).filter((s) => !!s.listId && state.subscriptionIdSet.has(s.listId))
    .length

export const inboxSubscriptionCountSelector = (state: State) =>
  Object.values(state.data).filter(
    (s) => !!s.inboxId && state.feedIdByView[FeedViewType.Articles].includes(s.inboxId),
  ).length
