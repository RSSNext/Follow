import { useRouteParms } from "@renderer/hooks/biz/useRouteParams"
import { ROUTE_FEED_PENDING, views } from "@renderer/lib/constants"
import type { FeedModel } from "@renderer/models"
import { useShallow } from "zustand/react/shallow"

import { useFeedStore } from "./store"

export const useFeedById = (feedId: Nullable<string>): FeedModel | null =>
  useFeedStore((state) => (feedId ? state.feeds[feedId] : null))

export const useFeedByIdSelector = <T>(
  feedId: Nullable<string>,
  selector: (feed: FeedModel) => T,
) => useFeedStore(useShallow((state) => (feedId && state.feeds[feedId] ? selector(state.feeds[feedId]) : null)))

export const useFeedHeaderTitle = () => {
  const { feedId: currentFeedId, category, view } = useRouteParms()

  const feedTitle = useFeedByIdSelector(currentFeedId, (feed) => feed.title)
  return currentFeedId === ROUTE_FEED_PENDING ?
    views[view].name :
    category || feedTitle
}
