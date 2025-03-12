import { cn } from "@follow/utils"
import { useCallback, useState } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import Animated, { FadeIn, FadeOut } from "react-native-reanimated"

import { Shuffle2CuteReIcon } from "@/src/icons/shuffle_2_cute_re"
import { toast } from "@/src/lib/toast"
import { useSubscription } from "@/src/store/subscription/hooks"
import { subscriptionSyncService } from "@/src/store/subscription/store"
import { accentColor } from "@/src/theme/colors"

import type { PresetFeedConfig } from "./preset"
import { presetFeeds } from "./preset"

const subscribeFeed = async (config: PresetFeedConfig) => {
  await subscriptionSyncService.subscribe({
    feedId: config.feedId,
    title: config.title,
    url: config.url,
    view: config.view,
    category: "",
    isPrivate: false,
  })

  toast.success(`Subscribed to ${config.title}`, {
    position: "bottom",
  })
}

const unsubscribeFeed = async (feedId: string) => {
  await subscriptionSyncService.unsubscribe(feedId)
  toast.success(`Unsubscribed from feed`, {
    position: "bottom",
  })
}

export const StepInterests = () => {
  const [displayFeeds, setDisplayFeeds] = useState<PresetFeedConfig[]>(presetFeeds.slice(0, 7))

  const shuffleFeeds = useCallback(() => {
    const shuffled = [...presetFeeds].sort(() => Math.random() - 0.5).slice(0, 7)
    setDisplayFeeds(shuffled)
  }, [])
  return (
    <View className="mt-[15vh] flex-1 items-center">
      <Text className="text-text mb-4 text-2xl font-bold">Discover Interests</Text>
      <Text className="text-text mb-8 px-6 text-center text-lg">
        Subscribe to feeds that match your interests.
      </Text>

      <View className="mb-8 w-full items-center">
        <View className="mb-4 flex-row items-center">
          <Text className="mr-2 text-base">Suggestions for you</Text>
          <TouchableOpacity
            onPress={shuffleFeeds}
            className="bg-accent/10 flex-row items-center rounded-full px-3 py-1"
          >
            <Shuffle2CuteReIcon height={16} width={16} color={accentColor} />
            <Text className="text-accent ml-1 text-sm">Shuffle</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row flex-wrap justify-center gap-2 px-4">
          {displayFeeds.map((feed) => (
            <FeedChip key={feed.feedId} {...feed} />
          ))}
        </View>
      </View>
    </View>
  )
}

const FeedChip = (feed: PresetFeedConfig) => {
  const isSubscribed = useSubscription(feed.feedId)

  const handleSubscribe = useCallback(
    async (feed: PresetFeedConfig) => {
      if (isSubscribed) {
        await unsubscribeFeed(feed.feedId)
        return
      }
      await subscribeFeed(feed)
    },
    [isSubscribed],
  )

  return (
    <Animated.View
      key={feed.feedId}
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(300)}
    >
      <TouchableOpacity
        onPress={() => handleSubscribe(feed)}
        className={cn(
          "flex rounded-full px-4 py-2",
          isSubscribed ? "bg-accent" : "bg-secondary-system-fill",
        )}
      >
        <Text className={`text-center text-sm ${isSubscribed ? "text-white" : "text-label"}`}>
          {feed.title}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  )
}
