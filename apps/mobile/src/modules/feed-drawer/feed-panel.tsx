import type { FeedViewType } from "@follow/constants"
import { cn } from "@follow/utils"
import { router } from "expo-router"
import type { FC } from "react"
import { createContext, memo, useContext, useMemo } from "react"
import {
  Animated,
  Easing,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useAnimatedValue,
  View,
} from "react-native"
import { useSharedValue } from "react-native-reanimated"

import { AccordionItem } from "@/src/components/ui/accordion"
import { FeedIcon } from "@/src/components/ui/icon/feed-icon"
import { ItemPressable } from "@/src/components/ui/pressable/item-pressable"
import { MingcuteRightLine } from "@/src/icons/mingcute_right_line"
import { useFeed } from "@/src/store/feed/hooks"
import {
  useGroupedSubscription,
  usePrefetchSubscription,
  useSortedGroupedSubscription,
  useSortedUngroupedSubscription,
  useSubscription,
} from "@/src/store/subscription/hooks"
import { useUnreadCount, useUnreadCounts } from "@/src/store/unread/hooks"

import {
  SubscriptionFeedCategoryContextMenu,
  SubscriptionFeedItemContextMenu,
} from "../context-menu/feeds"
import { useCurrentView, useFeedListSortMethod, useFeedListSortOrder } from "../subscription/atoms"
import { SortActionButton } from "../subscription/header-actions"
import { useSelectedCollection, useViewDefinition } from "./atoms"

export const FeedPanel = () => {
  const selectedCollection = useSelectedCollection()
  if (selectedCollection.type === "view") {
    return (
      <SafeAreaView className="flex flex-1 overflow-hidden">
        <ViewHeaderComponent view={selectedCollection.viewId} />
        <RecycleList view={selectedCollection.viewId} />
      </SafeAreaView>
    )
  }

  return
}

const ViewHeaderComponent = ({ view }: { view: FeedViewType }) => {
  const viewDef = useViewDefinition(view)
  return (
    <View className="border-b-separator border-b-hairline flex flex-row items-center gap-2">
      <Text className="text-text my-4 ml-4 text-2xl font-bold">{viewDef.name}</Text>
      <SortActionButton />
    </View>
  )
}

const useSortedSubscription = (view: FeedViewType) => {
  usePrefetchSubscription(view)
  const { grouped, unGrouped } = useGroupedSubscription(view)

  const sortBy = useFeedListSortMethod()
  const sortOrder = useFeedListSortOrder()
  const sortedGrouped = useSortedGroupedSubscription(grouped, sortBy, sortOrder)
  const sortedUnGrouped = useSortedUngroupedSubscription(unGrouped, sortBy, sortOrder)
  const data = useMemo(
    () => [...sortedGrouped, ...sortedUnGrouped],
    [sortedGrouped, sortedUnGrouped],
  )
  return data
}

const RecycleList = ({ view }: { view: FeedViewType }) => {
  const data = useSortedSubscription(view)
  return (
    <ScrollView>
      {data.map((item, index) => (
        <ItemRender
          key={typeof item === "string" ? item : item.category}
          item={item}
          index={index}
        />
      ))}
      {/* Just a placeholder */}
      <View className="h-10" />
    </ScrollView>
  )
}

const ItemRender = ({
  item,
}: {
  item: string | { category: string; subscriptionIds: string[] }
  index: number
  extraData?: {
    total: number
  }
}) => {
  if (typeof item === "string") {
    return <SubscriptionItem id={item} />
  }
  const { category, subscriptionIds } = item

  return <CategoryGrouped category={category} subscriptionIds={subscriptionIds} />
}

const UnGroupedList: FC<{
  subscriptionIds: string[]
}> = ({ subscriptionIds }) => {
  const sortBy = useFeedListSortMethod()
  const sortOrder = useFeedListSortOrder()
  const sortedSubscriptionIds = useSortedUngroupedSubscription(subscriptionIds, sortBy, sortOrder)
  const lastSubscriptionId = sortedSubscriptionIds.at(-1)

  return sortedSubscriptionIds.map((id) => {
    return (
      <SubscriptionItem
        key={id}
        id={id}
        className={id === lastSubscriptionId ? "border-b-transparent" : ""}
      />
    )
  })
}

const GroupedContext = createContext<string | null>(null)

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity)

const CategoryGrouped = memo(
  ({ category, subscriptionIds }: { category: string; subscriptionIds: string[] }) => {
    const unreadCounts = useUnreadCounts(subscriptionIds)
    const isExpanded = useSharedValue(false)
    const rotateValue = useAnimatedValue(1)
    return (
      <SubscriptionFeedCategoryContextMenu category={category} feedIds={subscriptionIds}>
        <ItemPressable
          onPress={() => {
            // TODO navigate to category
          }}
          className="h-12 flex-row items-center px-3"
        >
          <AnimatedTouchableOpacity
            hitSlop={10}
            onPress={() => {
              Animated.timing(rotateValue, {
                toValue: isExpanded.value ? 1 : 0,
                easing: Easing.linear,

                useNativeDriver: true,
              }).start()
              isExpanded.value = !isExpanded.value
            }}
            style={[
              {
                transform: [
                  {
                    rotate: rotateValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["90deg", "0deg"],
                    }),
                  },
                ],
              },
              style.accordionIcon,
            ]}
          >
            <MingcuteRightLine color="gray" height={18} width={18} />
          </AnimatedTouchableOpacity>
          <Text className="text-text ml-3">{category}</Text>
          {!!unreadCounts && (
            <Text className="text-tertiary-label ml-auto text-xs">{unreadCounts}</Text>
          )}
        </ItemPressable>
        <AccordionItem isExpanded={isExpanded} viewKey={category}>
          <GroupedContext.Provider value={category}>
            <UnGroupedList subscriptionIds={subscriptionIds} />
          </GroupedContext.Provider>
        </AccordionItem>
      </SubscriptionFeedCategoryContextMenu>
    )
  },
)

const SubscriptionItem = memo(({ id, className }: { id: string; className?: string }) => {
  const subscription = useSubscription(id)
  const unreadCount = useUnreadCount(id)
  const feed = useFeed(id)
  const inGrouped = !!useContext(GroupedContext)
  const view = useCurrentView()

  if (!subscription || !feed) return null

  return (
    <SubscriptionFeedItemContextMenu id={id} view={view}>
      <ItemPressable
        className={cn(
          "flex h-12 flex-row items-center",
          inGrouped ? "pl-8 pr-4" : "px-4",
          className,
        )}
        onPress={() => {
          router.push({
            pathname: `/feeds/[feedId]`,
            params: {
              feedId: id,
            },
          })
        }}
      >
        <View className="dark:border-tertiary-system-background mr-3 size-5 items-center justify-center overflow-hidden rounded-full border border-transparent dark:bg-[#222]">
          <FeedIcon feed={feed} />
        </View>
        <Text numberOfLines={1} className="text-text flex-1">
          {subscription.title || feed.title}
        </Text>
        {!!unreadCount && (
          <Text className="text-tertiary-label ml-auto text-xs">{unreadCount}</Text>
        )}
      </ItemPressable>
    </SubscriptionFeedItemContextMenu>
  )
})

const style = StyleSheet.create({
  accordionIcon: {
    height: 20,
    width: 20,
    alignItems: "center",
    justifyContent: "center",
  },
})
