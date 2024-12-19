import { cn } from "@follow/utils"
import { Link, Stack } from "expo-router"
import { useAtomValue } from "jotai"
import { memo, useState } from "react"
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { ThemedBlurView } from "@/src/components/common/ThemedBlurView"
import { FeedIcon } from "@/src/components/ui/feed-icon"
import { views } from "@/src/constants/views"
import { AddCuteReIcon } from "@/src/icons/add_cute_re"
import { useFeed } from "@/src/store/feed/hooks"
import {
  usePrefetchSubscription,
  useSubscription,
  useSubscriptionByView,
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
  const subscriptionIds = useSubscriptionByView(currentView)

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

      {subscriptionIds.map((id) => {
        return <SubscriptionItem key={id} id={id} />
      })}
    </View>
  )
}

const SubscriptionItem = memo(({ id }: { id: string }) => {
  const subscription = useSubscription(id)
  const feed = useFeed(id)
  const [isPressing, setIsPressing] = useState(false)
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
        "flex h-9 flex-row items-center px-4",

        isPressing ? "bg-tertiary-system-background" : "bg-system-background",
      )}
    >
      <View className="mr-2 overflow-hidden rounded-full">
        <FeedIcon feed={feed} />
      </View>
      <Text className="text-text">{subscription.title || feed.title}</Text>
    </Pressable>
  )
})
