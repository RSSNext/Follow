import type { FeedViewType } from "@follow/constants"
import type { FlashList } from "@shopify/flash-list"
import { useMemo, useState } from "react"
import { Text, View } from "react-native"
import { useEventCallback } from "usehooks-ts"

import { useRegisterNavigationScrollView } from "@/src/components/layouts/tabbar/hooks"
import {
  GROUPED_ICON_TEXT_GAP,
  GROUPED_LIST_ITEM_PADDING,
  GROUPED_LIST_MARGIN,
  GROUPED_SECTION_BOTTOM_MARGIN,
  GROUPED_SECTION_TOP_MARGIN,
} from "@/src/components/ui/grouped/constants"
import { GroupedInsetListCard } from "@/src/components/ui/grouped/GroupedList"
import { ItemPressableStyle } from "@/src/components/ui/pressable/enum"
import { ItemPressable } from "@/src/components/ui/pressable/ItemPressable"
import { StarCuteFiIcon } from "@/src/icons/star_cute_fi"
import { useNavigation } from "@/src/lib/navigation/hooks"
import { closeDrawer, getHorizontalScrolling, selectFeed } from "@/src/modules/screen/atoms"
import { TimelineSelectorList } from "@/src/modules/screen/TimelineSelectorList"
import { FeedScreen } from "@/src/screens/(stack)/feeds/[feedId]"
import { FEED_COLLECTION_LIST } from "@/src/store/entry/utils"
import {
  useGroupedSubscription,
  useInboxSubscription,
  useListSubscription,
  useSortedGroupedSubscription,
  useSortedListSubscription,
  useSortedUngroupedSubscription,
} from "@/src/store/subscription/hooks"
import { subscriptionSyncService } from "@/src/store/subscription/store"

import { useFeedListSortMethod, useFeedListSortOrder } from "./atoms"
import { CategoryGrouped } from "./CategoryGrouped"
import { InboxItem } from "./items/InboxItem"
import { ListSubscriptionItem } from "./items/ListSubscriptionItem"
import { SubscriptionItem } from "./items/SubscriptionItem"

const keyExtractor = (item: string | { category: string; subscriptionIds: string[] }) => {
  if (typeof item === "string") {
    return item
  }
  return item.category
}

export const SubscriptionList = ({
  view,
  active = true,
}: {
  view: FeedViewType
  active?: boolean
}) => {
  const listIds = useListSubscription(view)
  const sortedListIds = useSortedListSubscription(listIds, "alphabet")

  const inboxes = useInboxSubscription(view)

  const { grouped, unGrouped } = useGroupedSubscription(view)

  const sortBy = useFeedListSortMethod()
  const sortOrder = useFeedListSortOrder()
  const sortedGrouped = useSortedGroupedSubscription(grouped, sortBy, sortOrder)
  const sortedUnGrouped = useSortedUngroupedSubscription(unGrouped, sortBy, sortOrder)

  const data = useMemo(
    () => [
      "Starred",
      "Lists",
      ...sortedListIds,
      "Inbox",
      ...inboxes,
      "Feeds",
      ...sortedGrouped,
      ...sortedUnGrouped,
    ],
    [inboxes, sortedListIds, sortedGrouped, sortedUnGrouped],
  )

  const extraData = useMemo(() => {
    const listsIndexStart = 2
    const listsIndexEnd = listsIndexStart + sortedListIds.length - 1
    const inboxIndexStart = listsIndexEnd + 2
    const inboxIndexEnd = inboxIndexStart + inboxes.length - 1
    const feedsIndexStart = inboxIndexEnd + 2
    const feedsIndexEnd = feedsIndexStart + sortedGrouped.length + sortedUnGrouped.length - 1
    const groupedIndexStart = inboxIndexEnd + 2
    const groupedIndexEnd = groupedIndexStart + sortedGrouped.length - 1
    return {
      inboxIndexRange: [inboxIndexStart, inboxIndexEnd],
      feedsIndexRange: [feedsIndexStart, feedsIndexEnd],
      listsIndexRange: [listsIndexStart, listsIndexEnd],
      groupedIndexRange: [groupedIndexStart, groupedIndexEnd],
    }
  }, [inboxes.length, sortedGrouped.length, sortedListIds.length, sortedUnGrouped.length])

  const [refreshing, setRefreshing] = useState(false)
  const onRefresh = useEventCallback(() => {
    return subscriptionSyncService.fetch(view)
  })

  const scrollViewRef = useRegisterNavigationScrollView<FlashList<any>>(active)

  return (
    <TimelineSelectorList
      contentContainerClassName="pb-6"
      ref={scrollViewRef}
      onRefresh={() => {
        setRefreshing(true)
        onRefresh().finally(() => {
          setRefreshing(false)
        })
      }}
      isRefetching={refreshing}
      data={data}
      estimatedItemSize={50}
      renderItem={ItemRender}
      keyExtractor={keyExtractor}
      // itemLayoutAnimation={LinearTransition}
      extraData={extraData}
    />
  )
}

const ItemRender = ({
  item,
  index,
  extraData,
}: {
  item: string | { category: string; subscriptionIds: string[] }
  index: number
  extraData?: {
    inboxIndexRange: [number, number]
    feedsIndexRange: [number, number]
    listsIndexRange: [number, number]
    groupedIndexRange: [number, number]
  }
}) => {
  if (typeof item === "string") {
    switch (item) {
      case "Starred": {
        return <StarItem />
      }
      case "Inbox": {
        if (!extraData) return null
        const { inboxIndexRange } = extraData
        if (inboxIndexRange[0] > inboxIndexRange[1]) return null
        return <SectionTitle title={item} />
      }
      case "Lists": {
        if (!extraData) return null
        const { listsIndexRange } = extraData
        if (listsIndexRange[0] > listsIndexRange[1]) return null
        return <SectionTitle title={item} />
      }
      case "Feeds": {
        if (!extraData) return null
        const { feedsIndexRange } = extraData
        if (feedsIndexRange[0] > feedsIndexRange[1]) return null
        return <SectionTitle title={item} />
      }
      default: {
        if (!extraData) return null
        const { inboxIndexRange, feedsIndexRange, listsIndexRange } = extraData

        if (listsIndexRange[0] <= index && index <= listsIndexRange[1]) {
          const isFirst = index === listsIndexRange[0]
          const isLast = index === listsIndexRange[1]
          return <ListSubscriptionItem id={item} isFirst={isFirst} isLast={isLast} />
        }

        if (inboxIndexRange[0] <= index && index <= inboxIndexRange[1]) {
          const isFirst = index === inboxIndexRange[0]
          const isLast = index === inboxIndexRange[1]
          return <InboxItem id={item} isFirst={isFirst} isLast={isLast} />
        }

        if (feedsIndexRange[0] <= index && index <= feedsIndexRange[1]) {
          const isFirst = index === feedsIndexRange[0]
          const isLast = index === feedsIndexRange[1]
          return <SubscriptionItem id={item} isFirst={isFirst} isLast={isLast} />
        }

        return null
      }
    }
  }

  const { category, subscriptionIds } = item

  if (!extraData) return null
  const { feedsIndexRange } = extraData
  const isFirst = index === feedsIndexRange[0]
  const isLast = index === feedsIndexRange[1]

  return (
    <CategoryGrouped
      category={category}
      subscriptionIds={subscriptionIds}
      isFirst={isFirst}
      isLast={isLast}
    />
  )
}

const SectionTitle = ({ title }: { title: string }) => {
  return (
    <View
      style={{
        marginHorizontal: GROUPED_LIST_MARGIN,
        marginTop: GROUPED_SECTION_TOP_MARGIN,
        marginBottom: GROUPED_SECTION_BOTTOM_MARGIN,
        paddingHorizontal: GROUPED_LIST_ITEM_PADDING,
      }}
    >
      <Text className="text-secondary-label" ellipsizeMode="tail" numberOfLines={1}>
        {title}
      </Text>
    </View>
  )
}

const StarItem = () => {
  const navigation = useNavigation()

  return (
    <GroupedInsetListCard showSeparator={false} className="mt-4">
      <ItemPressable
        itemStyle={ItemPressableStyle.Grouped}
        onPress={() => {
          const isHorizontalScrolling = getHorizontalScrolling()
          if (isHorizontalScrolling) {
            return
          }
          selectFeed({ type: "feed", feedId: FEED_COLLECTION_LIST })
          closeDrawer()
          navigation.pushControllerView(FeedScreen, {
            feedId: FEED_COLLECTION_LIST,
          })
        }}
        className="h-12 w-full flex-row items-center px-3"
      >
        <StarCuteFiIcon color="rgb(245, 158, 11)" height={20} width={20} />
        <Text className="text-text ml-2 font-medium" style={{ marginLeft: GROUPED_ICON_TEXT_GAP }}>
          Starred
        </Text>
      </ItemPressable>
    </GroupedInsetListCard>
  )
}
