import { cn } from "@follow/utils"
import { Link, Stack } from "expo-router"
import { useAtomValue } from "jotai"
import type { FC } from "react"
import { createContext, memo, useContext, useState } from "react"
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  useAnimatedValue,
  View,
} from "react-native"
import { useSharedValue } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { ThemedBlurView } from "@/src/components/common/ThemedBlurView"
import { AccordionItem } from "@/src/components/ui/accordion"
import { FeedIcon } from "@/src/components/ui/feed-icon"
import { views } from "@/src/constants/views"
import { AddCuteReIcon } from "@/src/icons/add_cute_re"
import { MingcuteRightLine } from "@/src/icons/mingcute_right_line"
import { useFeed } from "@/src/store/feed/hooks"
import {
  useGroupedSubscription,
  usePrefetchSubscription,
  useSortedGroupedSubscription,
  useSortedUngroupedSubscription,
  useSubscription,
} from "@/src/store/subscription/hooks"
import { accentColor } from "@/src/theme/colors"

import { viewAtom } from "./atoms"

const useActionPadding = () => {
  const insets = useSafeAreaInsets()
  return { paddingLeft: insets.left + 12, paddingRight: insets.right + 12 }
}

function LeftAction() {
  const handleEdit = () => {
    //TODO
  }

  const insets = useActionPadding()

  return (
    <TouchableOpacity onPress={handleEdit} style={{ paddingLeft: insets.paddingLeft }}>
      <Text className="text-lg text-accent">Edit</Text>
    </TouchableOpacity>
  )
}

function RightAction() {
  const insets = useActionPadding()

  return (
    <View className="flex-row items-center" style={{ paddingRight: insets.paddingRight }}>
      <Link asChild href="/add">
        <TouchableOpacity>
          <AddCuteReIcon color={accentColor} />
        </TouchableOpacity>
      </Link>
    </View>
  )
}

export const SubscriptionList = () => {
  const currentView = useAtomValue(viewAtom)
  usePrefetchSubscription(currentView)

  const { grouped, unGrouped } = useGroupedSubscription(currentView)

  return (
    <View>
      <Stack.Screen
        options={{
          headerShown: true,
          title: views[currentView].name,
          headerLeft: LeftAction,
          headerRight: RightAction,
          headerBackground: () => (
            <ThemedBlurView
              style={{
                ...StyleSheet.absoluteFillObject,
                overflow: "hidden",
                backgroundColor: "transparent",
              }}
            />
          ),

          headerTransparent: true,
        }}
      />
      <CategoryList grouped={grouped} />

      <UnGroupedList subscriptionIds={unGrouped} />
    </View>
  )
}

const UnGroupedList: FC<{
  subscriptionIds: string[]
}> = ({ subscriptionIds }) => {
  const sortedSubscriptionIds = useSortedUngroupedSubscription(subscriptionIds, "alphabet")
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

const CategoryList: FC<{
  grouped: Record<string, string[]>
}> = ({ grouped }) => {
  const sortedGrouped = useSortedGroupedSubscription(grouped, "alphabet")

  return sortedGrouped.map(({ category, subscriptionIds }) => {
    return <CategoryGrouped key={category} category={category} subscriptionIds={subscriptionIds} />
  })
}

const CategoryGrouped = memo(
  ({ category, subscriptionIds }: { category: string; subscriptionIds: string[] }) => {
    const isExpanded = useSharedValue(false)
    const rotateValue = useAnimatedValue(0)
    return (
      <View>
        <View className="border-secondary-system-grouped-background h-12 flex-row items-center border-b px-2">
          <AnimatedTouchableOpacity
            onPress={() => {
              isExpanded.value = !isExpanded.value

              Animated.spring(rotateValue, {
                toValue: isExpanded.value ? 1 : 0,
                stiffness: 100,
                damping: 10,
                useNativeDriver: true,
              }).start()
            }}
            style={{
              transform: [
                {
                  rotate: rotateValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["90deg", "0deg"],
                  }),
                },
              ],
            }}
          >
            <MingcuteRightLine color="gray" height={18} width={18} />
          </AnimatedTouchableOpacity>
          <Text className="text-text ml-1 font-medium">{category}</Text>
        </View>
        <AccordionItem isExpanded={isExpanded} viewKey={category}>
          <GroupedContext.Provider value={category}>
            <UnGroupedList subscriptionIds={subscriptionIds} />
          </GroupedContext.Provider>
        </AccordionItem>
      </View>
    )
  },
)

const SubscriptionItem = memo(({ id, className }: { id: string; className?: string }) => {
  const subscription = useSubscription(id)
  const feed = useFeed(id)
  const [isPressing, setIsPressing] = useState(false)
  const inGrouped = !!useContext(GroupedContext)
  if (!subscription || !feed) return null
  return (
    <Pressable
      onPressIn={() => {
        setIsPressing(true)
      }}
      onPressOut={() => {
        setIsPressing(false)
      }}
      className={cn(
        "flex h-12 flex-row items-center",
        inGrouped ? "px-8" : "px-4",
        isPressing ? "bg-tertiary-system-background" : "bg-system-background",
        "border-secondary-system-grouped-background border-b",
        className,
      )}
    >
      <View className="dark:border-tertiary-system-background mr-2 overflow-hidden rounded-full border border-transparent">
        <FeedIcon feed={feed} />
      </View>
      <Text className="text-text">{subscription.title || feed.title}</Text>
    </Pressable>
  )
})
