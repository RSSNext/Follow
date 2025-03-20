import { cn } from "@follow/utils"
import { memo, useContext } from "react"
import { ActivityIndicator, Text, View } from "react-native"
import Animated, { FadeOutUp } from "react-native-reanimated"

import { GROUPED_ICON_TEXT_GAP, GROUPED_LIST_MARGIN } from "@/src/components/ui/grouped/constants"
import { FeedIcon } from "@/src/components/ui/icon/feed-icon"
import { ItemPressableStyle } from "@/src/components/ui/pressable/enum"
import { ItemPressable } from "@/src/components/ui/pressable/ItemPressable"
import { useNavigation } from "@/src/lib/navigation/hooks"
import {
  closeDrawer,
  getHorizontalScrolling,
  selectFeed,
  useSelectedFeed,
} from "@/src/modules/screen/atoms"
import { FeedScreen } from "@/src/screens/(stack)/feeds/[feedId]"
import { useFeed, usePrefetchFeed } from "@/src/store/feed/hooks"
import { useSubscription } from "@/src/store/subscription/hooks"
import { useUnreadCount } from "@/src/store/unread/hooks"

import { SubscriptionFeedItemContextMenu } from "../../context-menu/feeds"
import { GroupedContext } from "../ctx"
import { ItemSeparator, SecondaryItemSeparator } from "../ItemSeparator"
import type { SubscriptionItemBaseProps } from "./types"
import { UnreadCount } from "./UnreadCount"

export const SubscriptionItem = memo(
  ({ id, isFirst, isLast, className }: SubscriptionItemBaseProps) => {
    const subscription = useSubscription(id)
    const unreadCount = useUnreadCount(id)
    const feed = useFeed(id)!
    const inGrouped = !!useContext(GroupedContext)
    const { isLoading } = usePrefetchFeed(id, { enabled: !subscription && !feed })

    const selectedFeed = useSelectedFeed()
    const view = selectedFeed?.type === "view" ? selectedFeed.viewId : undefined

    const navigation = useNavigation()
    if (isLoading) {
      return (
        <View className="mt-24 flex-1 flex-row items-start justify-center">
          <ActivityIndicator />
        </View>
      )
    }

    if (!subscription && !feed) return null

    return (
      <>
        <Animated.View
          exiting={FadeOutUp}
          style={{ marginHorizontal: GROUPED_LIST_MARGIN }}
          className={cn("overflow-hidden", {
            "rounded-t-[10px]": isFirst,
            "rounded-b-[10px]": isLast,
          })}
        >
          <SubscriptionFeedItemContextMenu id={id} view={view}>
            <ItemPressable
              itemStyle={ItemPressableStyle.Grouped}
              className={cn(
                "flex h-12 flex-row items-center",
                inGrouped ? "pl-8 pr-4" : "px-4",

                className,
              )}
              onPress={() => {
                const isHorizontalScrolling = getHorizontalScrolling()
                if (isHorizontalScrolling) {
                  return
                }
                selectFeed({
                  type: "feed",
                  feedId: id,
                })
                closeDrawer()
                navigation.pushControllerView(FeedScreen, {
                  feedId: id,
                })
              }}
            >
              <View className="dark:border-tertiary-system-background size-5 items-center justify-center overflow-hidden rounded border border-transparent dark:bg-[#222]">
                <FeedIcon feed={feed} />
              </View>
              <Text
                numberOfLines={1}
                className="text-text flex-1 font-medium"
                style={{ marginLeft: GROUPED_ICON_TEXT_GAP }}
              >
                {subscription?.title || feed.title}
              </Text>
              <UnreadCount unread={unreadCount} className="ml-auto" />
            </ItemPressable>
          </SubscriptionFeedItemContextMenu>
        </Animated.View>
        {!isLast && (inGrouped ? <SecondaryItemSeparator /> : <ItemSeparator />)}
      </>
    )
  },
)
