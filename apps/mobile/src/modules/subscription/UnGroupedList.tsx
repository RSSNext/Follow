import type { FC } from "react"
import { View } from "react-native"

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
    <View>
      {sortedSubscriptionIds.map((id, index) => (
        <View key={id}>
          <SubscriptionItem key={id} id={id} />
          {index !== sortedSubscriptionIds.length - 1 && <ItemSeparator />}
        </View>
      ))}
    </View>
  )
}
