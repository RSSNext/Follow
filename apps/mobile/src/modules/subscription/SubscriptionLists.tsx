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
  useSortedGroupedSubscription,
  useSortedUngroupedSubscription,
} from "@/src/store/subscription/hooks"
import { subscriptionSyncService } from "@/src/store/subscription/store"

import { useFeedListSortMethod, useFeedListSortOrder } from "./atoms"
import { CategoryGrouped } from "./CategoryGrouped"
import { SubscriptionItem } from "./items/SubscriptionItem"
import { ItemSeparator } from "./ItemSeparator"

const keyExtractor = (item: string | { category: string; subscriptionIds: string[] }) => {
  if (typeof item === "string") {
    return item
  }
  return item.category
}

export const SubscriptionList = ({ view }: { view: FeedViewType }) => {
  const { grouped, unGrouped } = useGroupedSubscription(view)

  const sortBy = useFeedListSortMethod()
  const sortOrder = useFeedListSortOrder()
  const sortedGrouped = useSortedGroupedSubscription(grouped, sortBy, sortOrder)
  const sortedUnGrouped = useSortedUngroupedSubscription(unGrouped, sortBy, sortOrder)
  const data = useMemo(
    () => [...sortedGrouped, ...sortedUnGrouped],
    [sortedGrouped, sortedUnGrouped],
  )

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
      ItemSeparatorComponent={ItemSeparator}
      data={data}
      ListHeaderComponent={ListHeaderComponent}
      renderItem={ItemRender}
      keyExtractor={keyExtractor}
      // itemLayoutAnimation={LinearTransition}
      extraData={{
        total: data.length,
      }}
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
    total: number
  }
}) => {
  if (typeof item === "string") {
    return (
      <SubscriptionItem
        id={item}
        className={extraData && index === extraData.total - 1 ? "border-b-transparent" : ""}
      />
    )
  }
  const { category, subscriptionIds } = item

  return <CategoryGrouped category={category} subscriptionIds={subscriptionIds} />
}

const ListHeaderComponent = () => {
  return (
    <>
      <StarItem />
      <Text className="text-gray mb-2 ml-3 mt-4 text-sm font-semibold">Feeds</Text>
    </>
  )
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
