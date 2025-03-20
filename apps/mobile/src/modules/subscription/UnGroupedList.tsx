import type { FC } from "react"
import { View } from "react-native"

import { useSortedUngroupedSubscription } from "@/src/store/subscription/hooks"

import { useFeedListSortMethod, useFeedListSortOrder } from "./atoms"
import { SubscriptionItem } from "./items/SubscriptionItem"

export const UnGroupedList: FC<{
  subscriptionIds: string[]
}> = ({ subscriptionIds }) => {
  const sortBy = useFeedListSortMethod()
  const sortOrder = useFeedListSortOrder()
  const sortedSubscriptionIds = useSortedUngroupedSubscription(subscriptionIds, sortBy, sortOrder)

  return (
    <>
      {sortedSubscriptionIds.map((id) => (
        <View key={id}>
          <SubscriptionItem key={id} id={id} isFirst={false} isLast={false} />
        </View>
      ))}
    </>
  )
}
