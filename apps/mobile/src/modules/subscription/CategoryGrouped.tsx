import { memo, useState } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated"

import { ItemPressable } from "@/src/components/ui/pressable/item-pressable"
import { MingcuteRightLine } from "@/src/icons/mingcute_right_line"
import { useUnreadCounts } from "@/src/store/unread/hooks"

import { SubscriptionFeedCategoryContextMenu } from "../context-menu/feeds"
import { GroupedContext } from "./ctx"
import { UnGroupedList } from "./UnGroupedList"

// const CategoryList: FC<{
//   grouped: Record<string, string[]>
// }> = ({ grouped }) => {
//   const sortedGrouped = useSortedGroupedSubscription(grouped, "alphabet")
//   return sortedGrouped.map(({ category, subscriptionIds }) => {
//     return <CategoryGrouped key={category} category={category} subscriptionIds={subscriptionIds} />
//   })
// }
export const CategoryGrouped = memo(
  ({ category, subscriptionIds }: { category: string; subscriptionIds: string[] }) => {
    const unreadCounts = useUnreadCounts(subscriptionIds)
    const [expanded, setExpanded] = useState(false)
    const rotateSharedValue = useSharedValue(0)
    const rotateStyle = useAnimatedStyle(() => {
      return {
        transform: [{ rotate: `${rotateSharedValue.value}deg` }],
      }
    }, [rotateSharedValue])
    return (
      <>
        <SubscriptionFeedCategoryContextMenu category={category} feedIds={subscriptionIds}>
          <ItemPressable
            onPress={() => {
              // TODO navigate to category
            }}
            className="border-item-pressed h-12 flex-row items-center border-b px-3"
          >
            <TouchableOpacity
              hitSlop={10}
              onPress={() => {
                rotateSharedValue.value = withSpring(expanded ? 0 : 90, {})
                setExpanded(!expanded)
              }}
              className="size-5 flex-row items-center justify-center"
            >
              <Animated.View style={rotateStyle}>
                <MingcuteRightLine color="gray" height={18} width={18} />
              </Animated.View>
            </TouchableOpacity>
            <Text className="text-text ml-3">{category}</Text>
            {!!unreadCounts && (
              <Text className="text-tertiary-label ml-auto text-xs">{unreadCounts}</Text>
            )}
          </ItemPressable>
        </SubscriptionFeedCategoryContextMenu>

        {expanded && (
          <GroupedContext.Provider value={category}>
            <View>
              <UnGroupedList subscriptionIds={subscriptionIds} />
            </View>
          </GroupedContext.Provider>
        )}
      </>
    )
  },
)
