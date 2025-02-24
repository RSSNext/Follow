import type { FeedViewType } from "@follow/constants"
import { cn } from "@follow/utils"
import { getDefaultHeaderHeight } from "@react-navigation/elements"
import { Fragment, useCallback, useEffect, useMemo } from "react"
import {
  ActivityIndicator,
  FlatList,
  Image,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated"
import { useSafeAreaFrame, useSafeAreaInsets } from "react-native-safe-area-context"

import { ReAnimatedScrollView } from "@/src/components/common/AnimatedComponents"
import { BlurEffect } from "@/src/components/common/BlurEffect"
import { FallbackIcon } from "@/src/components/ui/icon/fallback-icon"
import type { FeedIconRequiredFeed } from "@/src/components/ui/icon/feed-icon"
import { FeedIcon } from "@/src/components/ui/icon/feed-icon"
import { Share3CuteReIcon } from "@/src/icons/share_3_cute_re"
import type { apiClient } from "@/src/lib/api-fetch"
import { toast } from "@/src/lib/toast"
import { useShareSubscription } from "@/src/modules/settings/hooks/useShareSubscription"
import { UserHeaderBanner } from "@/src/modules/settings/UserHeaderBanner"
import { ItemSeparator } from "@/src/modules/subscription/ItemSeparator"
import type { FeedModel } from "@/src/store/feed/types"
import type { ListModel } from "@/src/store/list/store"
import { useWhoami } from "@/src/store/user/hooks"
import { useColor } from "@/src/theme/colors"

type Subscription = Awaited<ReturnType<typeof apiClient.subscriptions.$get>>["data"][number]
export default function ProfileScreen() {
  const scrollY = useSharedValue(0)
  const { data: subscriptions, isLoading, isError } = useShareSubscription()

  const headerOpacity = useSharedValue(0)
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y
    headerOpacity.value = scrollY.value / 100
  })

  const whoami = useWhoami()

  useEffect(() => {
    if (isError) {
      toast.error("Failed to fetch subscriptions")
    }
  }, [isError])

  const insets = useSafeAreaInsets()

  const textLabelColor = useColor("label")
  const openShareUrl = useCallback(() => {
    if (!whoami?.id) return
    Share.share({
      url: `https://app.follow.is/share/users/${whoami.id}`,
      title: `Follow | ${whoami.name}'s Profile`,
    })
  }, [whoami?.id, whoami?.name])

  const frame = useSafeAreaFrame()
  const headerHeight = getDefaultHeaderHeight(frame, false, 0)

  return (
    <View className="bg-system-grouped-background flex-1">
      <ReAnimatedScrollView
        nestedScrollEnabled
        onScroll={scrollHandler}
        contentContainerStyle={{ paddingBottom: insets.bottom, paddingTop: headerHeight }}
      >
        <UserHeaderBanner scrollY={scrollY} />

        {isLoading && <ActivityIndicator className="mt-24" size={28} />}
        {!isLoading && subscriptions && <SubscriptionList subscriptions={subscriptions.data} />}
      </ReAnimatedScrollView>

      <View
        style={{ height: headerHeight }}
        className="absolute top-0 w-full flex-row items-center justify-between px-4"
      >
        <View />
        <TouchableOpacity onPress={openShareUrl}>
          <Share3CuteReIcon color="#fff" />
        </TouchableOpacity>
      </View>
      {/* Header */}
      <Animated.View
        pointerEvents="none"
        className="border-b-hairline border-opaque-separator absolute inset-x-0 top-0 flex-row items-center px-4"
        style={{ opacity: headerOpacity, height: headerHeight }}
      >
        <BlurEffect />

        <Text className="text-label flex-1 text-center text-lg font-medium">
          {whoami?.name}'s Profile
        </Text>

        <TouchableOpacity onPress={openShareUrl}>
          <Share3CuteReIcon color={textLabelColor} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  )
}

type PickedListModel = Pick<ListModel, "id" | "title" | "image" | "description" | "view"> & {
  customTitle?: string | null
}
type PickedFeedModel = Pick<
  FeedModel,
  "id" | "title" | "description" | "siteUrl" | "url" | "image"
> & {
  customTitle?: string | null
  view: FeedViewType
}
const SubscriptionList = ({ subscriptions }: { subscriptions: Subscription[] }) => {
  const { lists, feeds, groupedFeeds } = useMemo(() => {
    const lists = [] as PickedListModel[]
    const feeds = [] as PickedFeedModel[]

    const groupedFeeds = {} as Record<string, PickedFeedModel[]>

    for (const subscription of subscriptions) {
      if ("listId" in subscription) {
        lists.push({
          id: subscription.listId,
          title: subscription.lists.title!,
          image: subscription.lists.image!,
          description: subscription.lists.description!,
          view: subscription.lists.view,
          customTitle: subscription.title,
        })
        continue
      }

      if ("feedId" in subscription && "feeds" in subscription) {
        const feed = {
          id: subscription.feedId,
          title: subscription.feeds.title!,
          image: subscription.feeds.image!,
          description: subscription.feeds.description!,
          siteUrl: subscription.feeds.siteUrl!,
          url: subscription.feeds.url!,
          view: subscription.view as FeedViewType,
          customTitle: subscription.title,
        }

        if (subscription.category) {
          groupedFeeds[subscription.category] = [
            ...(groupedFeeds[subscription.category] || []),
            feed,
          ]
        } else {
          feeds.push(feed)
        }
      }
    }
    return { lists, feeds, groupedFeeds }
  }, [subscriptions])

  const hasFeeds = Object.keys(groupedFeeds).length > 0 || feeds.length > 0
  return (
    <View>
      {lists.length > 0 && (
        <Fragment>
          <SectionHeader title="Lists" />

          <FlatList
            scrollEnabled={false}
            data={lists}
            renderItem={renderListItems}
            ItemSeparatorComponent={ItemSeparator}
          />
        </Fragment>
      )}
      {hasFeeds && (
        <View className="mt-4">
          <SectionHeader title="Feeds" />
          {Object.entries(groupedFeeds).map(([category, feeds], index) => (
            <Fragment key={category}>
              <Text
                className={cn(
                  "text-secondary-label mb-2 ml-3 text-sm font-medium",
                  index !== 0 ? "mt-6" : "",
                )}
              >
                {category}
              </Text>
              <FlatList
                scrollEnabled={false}
                data={feeds}
                renderItem={renderFeedItems}
                ItemSeparatorComponent={ItemSeparator}
              />
            </Fragment>
          ))}

          <Text className="text-secondary-label mb-2 ml-3 mt-6 text-sm font-medium">
            Uncategorized Feeds
          </Text>
          <FlatList
            scrollEnabled={false}
            data={feeds}
            renderItem={renderFeedItems}
            ItemSeparatorComponent={ItemSeparator}
          />
        </View>
      )}
    </View>
  )
}
const renderListItems = ({ item }: { item: PickedListModel }) => (
  <View className="bg-secondary-system-grouped-background h-12 flex-row items-center px-3">
    <View className="overflow-hidden rounded">
      {!!item.image && (
        <Image source={{ uri: item.image, width: 24, height: 24 }} resizeMode="cover" />
      )}
      {!item.image && <FallbackIcon title={item.title} size={24} />}
    </View>

    <Text className="text-text ml-2">{item.title}</Text>
  </View>
)

const renderFeedItems = ({ item }: { item: PickedFeedModel }) => (
  <View className="bg-secondary-system-grouped-background h-12 flex-row items-center px-3">
    <View className="overflow-hidden rounded">
      <FeedIcon
        feed={
          {
            id: item.id,
            title: item.title,
            url: item.url,
            image: item.image,
            type: item.view,
            siteUrl: item.siteUrl || "",
          } as FeedIconRequiredFeed
        }
        size={24}
      />
    </View>
    <Text className="text-text ml-2">{item.title}</Text>
  </View>
)

const SectionHeader = ({ title }: { title: string }) => (
  <View className="my-5 flex-row items-center justify-center gap-4">
    <View
      className="bg-secondary-label w-12 rounded-full"
      style={{ height: StyleSheet.hairlineWidth }}
    />
    <Text className="text-secondary-label text-sm font-medium">{title}</Text>
    <View
      className="bg-secondary-label w-12 rounded-full"
      style={{ height: StyleSheet.hairlineWidth }}
    />
  </View>
)
