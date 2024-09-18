import { createAtomHooks } from "@renderer/lib/jotai"
import { getStorageNS } from "@renderer/lib/ns"
import { atomWithStorage } from "jotai/utils"

export type FeedListSortBy = "count" | "alphabetical"
export type FeedListSortOrder = "asc" | "desc"
const [, , useFeedListSort, , getFeedListSort, setFeedListSort, useFeedListSortSelector] =
  createAtomHooks(
    atomWithStorage(
      getStorageNS("feedListSort"),
      {
        by: "count" as FeedListSortBy,
        order: "desc" as FeedListSortOrder,
      },
      undefined,
      { getOnInit: true },
    ),
  )

export { getFeedListSort, useFeedListSort, useFeedListSortSelector }

export const setFeedListSortBy = (by: FeedListSortBy) => {
  setFeedListSort({
    ...getFeedListSort(),
    by,
  })
}

export const setFeedListSortOrder = (order: FeedListSortOrder) => {
  setFeedListSort({
    ...getFeedListSort(),
    order,
  })
}
