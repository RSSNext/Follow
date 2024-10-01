import { Fragment, useMemo } from "react"

import { sortByAlphabet } from "~/lib/utils"
import { getPreferredTitle, useFeedStore } from "~/store/feed"
import { useListByView } from "~/store/list"
import { getSubscriptionByFeedId } from "~/store/subscription"

import { useFeedListSortSelector } from "../atom"
import { FeedCategory } from "../category"
import { ListItem } from "../item"
import type { FeedListProps, ListListProps } from "./types"

export const SortByAlphabeticalFeedList = ({
  view,
  data,
  categoryOpenStateData,
}: FeedListProps) => {
  const categoryName2RealDisplayNameMap = useFeedStore((state) => {
    const map = {} as Record<string, string>
    for (const categoryName in data) {
      const feedId = data[categoryName][0]

      if (!feedId) {
        continue
      }
      const feed = state.feeds[feedId]
      if (!feed) {
        continue
      }
      const hascategoryNameNotDefault = !!getSubscriptionByFeedId(feedId)?.category
      const isSingle = data[categoryName].length === 1
      if (!isSingle || hascategoryNameNotDefault) {
        map[categoryName] = categoryName
      } else {
        map[categoryName] = getPreferredTitle(feed)!
      }
    }
    return map
  })

  const isDesc = useFeedListSortSelector((s) => s.order === "desc")

  let sortedByAlphabetical = Object.keys(data).sort((a, b) => {
    const nameA = categoryName2RealDisplayNameMap[a]
    const nameB = categoryName2RealDisplayNameMap[b]
    return sortByAlphabet(nameA, nameB)
  })
  if (!isDesc) {
    sortedByAlphabetical = sortedByAlphabetical.reverse()
  }

  return (
    <Fragment>
      {sortedByAlphabetical.map((category) => (
        <FeedCategory
          key={category}
          data={data[category]}
          view={view}
          categoryOpenStateData={categoryOpenStateData}
        />
      ))}
    </Fragment>
  )
}

export const SortByAlphabeticalListList = ({ view }: ListListProps) => {
  const isDesc = useFeedListSortSelector((s) => s.order === "desc")

  const lists = useListByView(view)

  const sortedLists = useMemo(() => {
    const res = lists.sort((a, b) => {
      return sortByAlphabet(a.title ?? "", b.title ?? "")
    })

    return isDesc ? res.reverse() : res
  }, [isDesc, lists])

  return (
    <div>
      {sortedLists.map((list) => (
        <ListItem key={list.id} listId={list.id} view={view} />
      ))}
    </div>
  )
}
