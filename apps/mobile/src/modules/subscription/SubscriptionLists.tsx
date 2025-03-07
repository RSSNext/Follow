import type { FeedViewType } from "@follow/constants"
import type { FlashList } from "@shopify/flash-list"
import { router } from "expo-router"
import { useMemo, useState } from "react"
import { Text } from "react-native"
import { useEventCallback } from "usehooks-ts"

import { useRegisterNavigationScrollView } from "@/src/components/layouts/tabbar/hooks"
import { ItemPressable } from "@/src/components/ui/pressable/ItemPressable"
import { StarCuteFiIcon } from "@/src/icons/star_cute_fi"
import { closeDrawer, selectFeed } from "@/src/modules/screen/atoms"
import { TimelineSelectorList } from "@/src/modules/screen/TimelineSelectorList"
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
import { ItemSeparator } from "./ItemSeparator"

const keyExtractor = (item: string | { category: string; subscriptionIds: string[] }) => {
  if (typeof item === "string") {
    return item
  }
  return item.category
}

export const SubscriptionList = ({ view }: { view: FeedViewType }) => {
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
    return {
      inboxIndexRange: [inboxIndexStart, inboxIndexEnd],
      feedsIndexRange: [feedsIndexStart, feedsIndexEnd],
      listsIndexRange: [listsIndexStart, listsIndexEnd],
    }
  }, [inboxes.length, sortedGrouped.length, sortedListIds.length, sortedUnGrouped.length])

  const [refreshing, setRefreshing] = useState(false)
  const onRefresh = useEventCallback(() => {
    return subscriptionSyncService.fetch(view)
  })

  const scrollViewRef = useRegisterNavigationScrollView<FlashList<any>>()

  return (
    <TimelineSelectorList
      ref={scrollViewRef}
      onRefresh={() => {
        setRefreshing(true)
        onRefresh().finally(() => {
          setRefreshing(false)
        })
      }}
      className="bg-system-grouped-background"
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
          return (
            <>
              <ListSubscriptionItem id={item} />
              {index !== listsIndexRange[1] ? <ItemSeparator /> : ""}
            </>
          )
        }

        if (inboxIndexRange[0] <= index && index <= inboxIndexRange[1]) {
          return (
            <>
              <InboxItem id={item} />
              {index !== inboxIndexRange[1] ? <ItemSeparator /> : ""}
            </>
          )
        }

        if (feedsIndexRange[0] <= index && index <= feedsIndexRange[1]) {
          return (
            <>
              <SubscriptionItem id={item} />
              {index !== feedsIndexRange[1] ? <ItemSeparator /> : ""}
            </>
          )
        }

        return null
      }
    }
  }

  const { category, subscriptionIds } = item

  return (
    <>
      <CategoryGrouped category={category} subscriptionIds={subscriptionIds} />
      {extraData && index !== extraData.feedsIndexRange[1] ? <ItemSeparator /> : ""}
    </>
  )
}

const SectionTitle = ({ title }: { title: string }) => {
  return <Text className="text-gray mb-2 ml-3 mt-4 text-sm font-semibold">{title}</Text>
}

const StarItem = () => {
  return (
    <ItemPressable
      onPress={() => {
        selectFeed({ type: "feed", feedId: FEED_COLLECTION_LIST })
        closeDrawer()
        router.push(`/feeds/${FEED_COLLECTION_LIST}`)
      }}
      className="mt-4 h-12 w-full flex-row items-center px-3"
    >
      <StarCuteFiIcon color="rgb(245, 158, 11)" height={20} width={20} />
      <Text className="text-text ml-2 font-medium">Starred</Text>
    </ItemPressable>
  )
}
