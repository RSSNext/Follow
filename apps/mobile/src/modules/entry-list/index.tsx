import { FeedViewType } from "@follow/constants"
import { useMemo } from "react"

import { useSelectedFeed, useSelectedView } from "@/src/modules/screen/atoms"
import { PagerList } from "@/src/modules/screen/PageList"
import { TimelineSelectorProvider } from "@/src/modules/screen/TimelineSelectorProvider"
import {
  useEntryIdsByCategory,
  useEntryIdsByFeedId,
  useEntryIdsByInboxId,
  useEntryIdsByListId,
  useEntryIdsByView,
} from "@/src/store/entry/hooks"

import { EntryListSelector } from "./EntryListSelector"

export function EntryList() {
  const selectedFeed = useSelectedFeed()

  const Content = useMemo(() => {
    if (!selectedFeed) return null
    switch (selectedFeed.type) {
      case "view": {
        return (
          <PagerList
            renderItem={(view, active) => (
              <ViewEntryList key={view} viewId={view} active={active} />
            )}
          />
        )
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
    }
  }, [selectedFeed])
  if (!Content) return null

  return <TimelineSelectorProvider>{Content}</TimelineSelectorProvider>
}

function ViewEntryList({ viewId, active }: { viewId: FeedViewType; active: boolean }) {
  const entryIds = useEntryIdsByView(viewId)
  return <EntryListSelector entryIds={entryIds} viewId={viewId} active={active} />
}

function FeedEntryList({ feedId }: { feedId: string }) {
  const view = useSelectedView() ?? FeedViewType.Articles
  const entryIds = useEntryIdsByFeedId(feedId)
  return <EntryListSelector entryIds={entryIds} viewId={view} />
}

function CategoryEntryList({ categoryName }: { categoryName: string }) {
  const view = useSelectedView() ?? FeedViewType.Articles
  const entryIds = useEntryIdsByCategory(categoryName)
  return <EntryListSelector entryIds={entryIds} viewId={view} />
}

function ListEntryList({ listId }: { listId: string }) {
  const view = useSelectedView() ?? FeedViewType.Articles
  const entryIds = useEntryIdsByListId(listId)
  if (!entryIds) return null
  return <EntryListSelector entryIds={entryIds} viewId={view} />
}

function InboxEntryList({ inboxId }: { inboxId: string }) {
  const view = useSelectedView() ?? FeedViewType.Articles
  const entryIds = useEntryIdsByInboxId(inboxId)
  return <EntryListSelector entryIds={entryIds} viewId={view} />
}
