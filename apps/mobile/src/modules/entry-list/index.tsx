import { FeedViewType } from "@follow/constants"
import { useIsFocused } from "@react-navigation/native"
import { useEffect, useMemo } from "react"
import { Animated, StyleSheet } from "react-native"
import PagerView from "react-native-pager-view"

import { views } from "@/src/constants/views"
import {
  selectTimeline,
  useSelectedFeed,
  useSelectedView,
  useSetDrawerSwipeDisabled,
} from "@/src/modules/screen/atoms"
import {
  useEntryIdsByCategory,
  useEntryIdsByFeedId,
  useEntryIdsByInboxId,
  useEntryIdsByView,
} from "@/src/store/entry/hooks"
import { useListEntryIds } from "@/src/store/list/hooks"

import { TimelineSelectorProvider } from "../screen/TimelineSelectorProvider"
import { EntryListSelector } from "./EntryListSelector"
import { usePagerView } from "./usePagerView"

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

  const Content = useMemo(() => {
    if (!selectedFeed) return null
    switch (selectedFeed.type) {
      case "view": {
        return <ViewPagerList viewId={selectedFeed.viewId} />
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

const AnimatedPagerView = Animated.createAnimatedComponent<typeof PagerView>(PagerView)

function ViewPagerList({ viewId }: { viewId: FeedViewType }) {
  const { page, pagerRef, ...rest } = usePagerView({
    initialPage: viewId,
    onIndexChange: (index) => {
      selectTimeline({ type: "view", viewId: index })
    },
  })

  useEffect(() => {
    if (page === viewId) return
    pagerRef.current?.setPage(viewId)
  }, [page, pagerRef, viewId])

  return (
    <AnimatedPagerView
      testID="pager-view"
      ref={pagerRef}
      style={styles.PagerView}
      initialPage={page}
      layoutDirection="ltr"
      overdrag
      onPageScroll={rest.onPageScroll}
      onPageSelected={rest.onPageSelected}
      onPageScrollStateChanged={rest.onPageScrollStateChanged}
      pageMargin={10}
      orientation="horizontal"
    >
      {useMemo(() => views.map((view) => <ViewEntryList viewId={view.view} key={view.view} />), [])}
    </AnimatedPagerView>
  )
}

function ViewEntryList({ viewId }: { viewId: FeedViewType }) {
  const entryIds = useEntryIdsByView(viewId)
  return <EntryListSelector entryIds={entryIds} viewId={viewId} />
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
  const entryIds = useListEntryIds(listId)
  if (!entryIds) return null
  return <EntryListSelector entryIds={entryIds} viewId={view} />
}

function InboxEntryList({ inboxId }: { inboxId: string }) {
  const view = useSelectedView() ?? FeedViewType.Articles
  const entryIds = useEntryIdsByInboxId(inboxId)
  return <EntryListSelector entryIds={entryIds} viewId={view} />
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  PagerView: {
    flex: 1,
  },
})
