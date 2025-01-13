import type { FC } from "react"
import { FlatList } from "react-native"

import { useSortedUngroupedSubscription } from "@/src/store/subscription/hooks"

import { useFeedListSortMethod, useFeedListSortOrder } from "./atoms"
import { SubscriptionItem } from "./items/SubscriptionItem"
import { ItemSeparator } from "./ItemSeparator"

export const UnGroupedList: FC<{
  subscriptionIds: string[]
}> = ({ subscriptionIds }) => {
  const sortBy = useFeedListSortMethod()
  const sortOrder = useFeedListSortOrder()
  const sortedSubscriptionIds = useSortedUngroupedSubscription(subscriptionIds, sortBy, sortOrder)

  return (
    <FlatList
      data={sortedSubscriptionIds}
      renderItem={renderSubscriptionItems}
      ItemSeparatorComponent={ItemSeparator}
    />
  )
}

const renderSubscriptionItems = ({ item }: { item: string }) => <SubscriptionItem id={item} />
