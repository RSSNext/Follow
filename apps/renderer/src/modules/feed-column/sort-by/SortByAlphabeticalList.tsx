import { Fragment } from "react"

import { INBOX_PREFIX_ID } from "~/constants"
import { sortByAlphabet } from "~/lib/utils"
import { getPreferredTitle, useFeedStore } from "~/store/feed"
import { getSubscriptionByFeedId } from "~/store/subscription"

import { useFeedListSortSelector } from "../atom"
import { FeedCategory } from "../category"
import { InboxItem, ListItem } from "../item"
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

export const SortByAlphabeticalListList = ({ view, data }: ListListProps) => {
  return (
    <div>
      {Object.keys(data).map((listId) => (
        <ListItem key={listId} listId={listId} view={view} />
      ))}
    </div>
  )
}

export const SortByAlphabeticalInboxList = ({ view, data }: ListListProps) => {
  return (
    <div>
      {Object.keys(data).map((feedId) => (
        <InboxItem
          key={feedId}
          inboxId={
            feedId.startsWith(INBOX_PREFIX_ID) ? feedId.slice(INBOX_PREFIX_ID.length) : feedId
          }
          view={view}
        />
      ))}
    </div>
  )
}
