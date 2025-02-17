import type { FeedViewType } from "@follow/constants"
import { useIsFocused } from "@react-navigation/native"
import { useEffect } from "react"

import { useSelectedFeed, useSetDrawerSwipeDisabled } from "@/src/modules/screen/atoms"
import {
  useEntryIdsByCategory,
  useEntryIdsByFeedId,
  useEntryIdsByInboxId,
  useEntryIdsByView,
} from "@/src/store/entry/hooks"
import { useListEntryIds } from "@/src/store/list/hooks"

import { EntryListSelector } from "./EntryListSelector"

export function EntryList() {
  const setDrawerSwipeDisabled = useSetDrawerSwipeDisabled()
  const isFocused = useIsFocused()
  useEffect(() => {
    if (isFocused) {
      setDrawerSwipeDisabled(false)
    } else {
      setDrawerSwipeDisabled(true)
    }
  }, [setDrawerSwipeDisabled, isFocused])

  const selectedFeed = useSelectedFeed()
  if (!selectedFeed) return null

  switch (selectedFeed.type) {
    case "view": {
      return <ViewEntryList viewId={selectedFeed.viewId} />
    }
    case "feed": {
      return <FeedEntryList feedId={selectedFeed.feedId} />
    }
    case "category": {
      return <CategoryEntryList categoryName={selectedFeed.categoryName} />
    }
    case "list": {
      return <ListEntryList listId={selectedFeed.listId} />
    }
    case "inbox": {
      return <InboxEntryList inboxId={selectedFeed.inboxId} />
    }
    // No default
  }
}

function ViewEntryList({ viewId }: { viewId: FeedViewType }) {
  const entryIds = useEntryIdsByView(viewId)
  return <EntryListSelector entryIds={entryIds} />
}

function FeedEntryList({ feedId }: { feedId: string }) {
  const entryIds = useEntryIdsByFeedId(feedId)
  return <EntryListSelector entryIds={entryIds} />
}

function CategoryEntryList({ categoryName }: { categoryName: string }) {
  const entryIds = useEntryIdsByCategory(categoryName)
  return <EntryListSelector entryIds={entryIds} />
}

function ListEntryList({ listId }: { listId: string }) {
  const entryIds = useListEntryIds(listId)
  if (!entryIds) return null
  return <EntryListSelector entryIds={entryIds} />
}

function InboxEntryList({ inboxId }: { inboxId: string }) {
  const entryIds = useEntryIdsByInboxId(inboxId)
  return <EntryListSelector entryIds={entryIds} />
}
