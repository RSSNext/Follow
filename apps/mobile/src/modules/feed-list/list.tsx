import { FeedViewType } from "@follow/constants"
import { cn } from "@follow/utils"
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"
import { useHeaderHeight } from "@react-navigation/elements"
import { router } from "expo-router"
import { useAtom } from "jotai"
import type { FC } from "react"
import { createContext, memo, useContext, useEffect, useRef } from "react"
import {
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useAnimatedValue,
  View,
} from "react-native"
import type {
  SwipeableMethods,
  SwipeableRef,
} from "react-native-gesture-handler/ReanimatedSwipeable"
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable"
import PagerView from "react-native-pager-view"
import ReAnimated, { FadeIn, useSharedValue } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { AccordionItem } from "@/src/components/ui/accordion"
import { FallbackIcon } from "@/src/components/ui/icon/fallback-icon"
import { FeedIcon } from "@/src/components/ui/icon/feed-icon"
import { ItemPressable } from "@/src/components/ui/pressable/item-pressable"
import { bottomViewTabHeight } from "@/src/constants/ui"
import { InboxCuteFiIcon } from "@/src/icons/inbox_cute_fi"
import { MingcuteRightLine } from "@/src/icons/mingcute_right_line"
import { StarCuteFiIcon } from "@/src/icons/star_cute_fi"
import { useFeed } from "@/src/store/feed/hooks"
import { useList } from "@/src/store/list/hooks"
import {
  useGroupedSubscription,
  useInboxSubscription,
  useListSubscription,
  usePrefetchSubscription,
  useSortedGroupedSubscription,
  useSortedListSubscription,
  useSortedUngroupedSubscription,
  useSubscription,
} from "@/src/store/subscription/hooks"
import { getInboxStoreId } from "@/src/store/subscription/utils"
import { useUnreadCount, useUnreadCounts } from "@/src/store/unread/hooks"

import { viewAtom } from "./atoms"
import { useViewPageCurrentView, ViewPageCurrentViewProvider } from "./ctx"

export const SubscriptionList = memo(() => {
  const [currentView, setCurrentView] = useAtom(viewAtom)

  const tabHeight = useBottomTabBarHeight()
  const headerHeight = useHeaderHeight()

  const insets = useSafeAreaInsets()

  const pagerRef = useRef<PagerView>(null)

  useEffect(() => {
    pagerRef.current?.setPage(currentView)
  }, [currentView])

  return (
    <>
      <StarItem />

      <PagerView
        pageMargin={1}
        onPageSelected={({ nativeEvent }) => {
          setCurrentView(nativeEvent.position)
        }}
        scrollEnabled
        style={style.flex}
        initialPage={0}
        ref={pagerRef}
      >
        {[
          FeedViewType.Articles,
          FeedViewType.SocialMedia,
          FeedViewType.Pictures,
          FeedViewType.Videos,
          FeedViewType.Audios,
          FeedViewType.Notifications,
        ].map((view) => {
          return (
            <ScrollView key={view} automaticallyAdjustContentInsets>
              <View style={{ height: headerHeight - insets.top + bottomViewTabHeight }} />
              <ViewPage view={view} />
              <View style={{ height: tabHeight }} />
            </ScrollView>
          )
        })}
      </PagerView>
    </>
  )
})

const ViewPage = memo(({ view }: { view: FeedViewType }) => {
  const { grouped, unGrouped } = useGroupedSubscription(view)
  usePrefetchSubscription(view)

  return (
    <ViewPageCurrentViewProvider value={view}>
      <StarItem />
      {view === FeedViewType.Articles && <InboxList />}
      <ListList />
      <Text className="text-tertiary-label mb-2 ml-3 mt-4 text-sm font-medium">Feeds</Text>
      <CategoryList grouped={grouped} />
      <UnGroupedList subscriptionIds={unGrouped} />
    </ViewPageCurrentViewProvider>
  )
})

const InboxList = () => {
  const inboxes = useInboxSubscription(FeedViewType.Articles)
  if (inboxes.length === 0) return null
  return (
    <View>
      <Text className="text-tertiary-label mb-2 ml-3 mt-4 text-sm font-medium">Inboxes</Text>
      {inboxes.map((id) => {
        return <InboxItem key={id} id={id} />
      })}
    </View>
  )
}

const InboxItem = memo(({ id }: { id: string }) => {
  const subscription = useSubscription(getInboxStoreId(id))
  const unreadCount = useUnreadCount(id)
  if (!subscription) return null
  return (
    <ItemPressable className="border-secondary-system-grouped-background h-12 flex-row items-center border-b px-3">
      <View className="ml-0.5 overflow-hidden rounded">
        <InboxCuteFiIcon height={20} width={20} />
      </View>

      <Text className="text-text ml-2.5">{subscription.title}</Text>
      {!!unreadCount && <Text className="text-tertiary-label ml-auto text-xs">{unreadCount}</Text>}
    </ItemPressable>
  )
})

const StarItem = () => {
  return (
    <ItemPressable
      onPress={() => {
        // TODO
      }}
      className="mt-4 h-12 w-full flex-row items-center px-3"
    >
      <StarCuteFiIcon color="rgb(245, 158, 11)" height={20} width={20} />
      <Text className="text-text ml-2">Collections</Text>
    </ItemPressable>
  )
}

const ListList = () => {
  const currentView = useViewPageCurrentView()
  const listIds = useListSubscription(currentView)
  const sortedListIds = useSortedListSubscription(listIds, "alphabet")
  if (sortedListIds.length === 0) return null
  return (
    <View className="mt-4">
      <Text className="text-tertiary-label mb-2 ml-3 text-sm font-medium">Lists</Text>
      {sortedListIds.map((id) => {
        return <ListSubscriptionItem key={id} id={id} />
      })}
    </View>
  )
}

const ListSubscriptionItem = memo(({ id }: { id: string; className?: string }) => {
  const list = useList(id)
  if (!list) return null
  return (
    <ItemPressable className="border-secondary-system-grouped-background h-12 flex-row items-center border-b px-3">
      <View className="overflow-hidden rounded">
        {!!list.image && (
          <Image source={{ uri: list.image, width: 24, height: 24 }} resizeMode="cover" />
        )}
        {!list.image && <FallbackIcon title={list.title} size={24} />}
      </View>

      <Text className="text-text ml-2">{list.title}</Text>
    </ItemPressable>
  )
})

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
    const unreadCounts = useUnreadCounts(subscriptionIds)
    const isExpanded = useSharedValue(false)
    const rotateValue = useAnimatedValue(1)
    return (
      <View>
        <ItemPressable
          onPress={() => {
            // TODO navigate to category
          }}
          className="border-secondary-system-grouped-background h-12 flex-row items-center border-b px-3"
        >
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
      </View>
    )
  },
)

const renderRightActions = () => {
  return (
    <ReAnimated.View entering={FadeIn} className="flex-row items-center">
      <TouchableOpacity
        className="bg-red h-full justify-center px-4"
        onPress={() => {
          // TODO: Handle unsubscribe
        }}
      >
        <Text className="text-base font-semibold text-white">Unsubscribe</Text>
      </TouchableOpacity>
    </ReAnimated.View>
  )
}

const renderLeftActions = () => {
  return (
    <ReAnimated.View entering={FadeIn} className="flex-row items-center">
      <TouchableOpacity
        className="bg-blue h-full justify-center px-4"
        onPress={() => {
          // TODO: Handle unsubscribe
        }}
      >
        <Text className="text-base font-semibold text-white">Read</Text>
      </TouchableOpacity>
    </ReAnimated.View>
  )
}

let prevOpenedRow: SwipeableMethods | null = null
const SubscriptionItem = memo(({ id, className }: { id: string; className?: string }) => {
  const subscription = useSubscription(id)
  const unreadCount = useUnreadCount(id)
  const feed = useFeed(id)
  const inGrouped = !!useContext(GroupedContext)
  const swipeableRef: SwipeableRef = useRef(null)

  if (!subscription || !feed) return null

  return (
    // FIXME: Here leads to very serious performance issues, the frame rate of both the UI and JS threads has dropped
    <Swipeable
      renderRightActions={renderRightActions}
      renderLeftActions={renderLeftActions}
      leftThreshold={40}
      rightThreshold={40}
      ref={swipeableRef}
      onSwipeableWillOpen={() => {
        if (prevOpenedRow && prevOpenedRow !== swipeableRef.current) {
          prevOpenedRow.close()
        }
        prevOpenedRow = swipeableRef.current
      }}
    >
      <ItemPressable
        className={cn(
          "bg-system-background flex h-12 flex-row items-center",
          inGrouped ? "pl-8 pr-4" : "px-4",
          "border-secondary-system-grouped-background border-b",
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
        <Text className="text-text">{subscription.title || feed.title}</Text>
        {!!unreadCount && (
          <Text className="text-tertiary-label ml-auto text-xs">{unreadCount}</Text>
        )}
      </ItemPressable>
    </Swipeable>
  )
})

const style = StyleSheet.create({
  flex: {
    flex: 1,
  },
  accordionIcon: {
    height: 20,
    width: 20,
    alignItems: "center",
    justifyContent: "center",
  },
})
