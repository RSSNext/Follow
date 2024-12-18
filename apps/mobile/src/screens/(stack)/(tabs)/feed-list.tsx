import { FeedViewType } from "@follow/constants"
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"
import { useHeaderHeight } from "@react-navigation/elements"
import { Link, Stack } from "expo-router"
import { atom, useAtom, useAtomValue } from "jotai"
import { memo } from "react"
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { ThemedBlurView } from "@/src/components/common/ThemedBlurView"
import { views } from "@/src/constants/views"
import { AddCuteReIcon } from "@/src/icons/add_cute_re"
import { useScaleWidth } from "@/src/lib/responsive"
import { useFeed } from "@/src/store/feed/hooks"
import { accentColor } from "@/src/theme/colors"

import {
  usePrefetchSubscription,
  useSubscription,
  useSubscriptionByView,
} from "../../../store/subscription/hooks"

const viewAtom = atom<FeedViewType>(FeedViewType.Articles)
const bottomViewTabHeight = 45
export default function FeedList() {
  const tabHeight = useBottomTabBarHeight()
  const headerHeight = useHeaderHeight()

  const insets = useSafeAreaInsets()
  return (
    <>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        scrollIndicatorInsets={{
          top: headerHeight - insets.top,
          bottom: tabHeight + bottomViewTabHeight - insets.bottom,
        }}
      >
        <View style={{ height: headerHeight - insets.top }} />
        <SubscriptionList />
        <View style={{ height: tabHeight + bottomViewTabHeight }} />
      </ScrollView>

      <ViewTab />
    </>
  )
}

const ViewTab = () => {
  const scaleWidth = useScaleWidth()

  const tabHeight = useBottomTabBarHeight()
  const paddingHorizontal = 4
  const [currentView, setCurrentView] = useAtom(viewAtom)

  return (
    <ThemedBlurView
      intensity={100}
      style={[
        styles.tabContainer,
        {
          backgroundColor: "transparent",
          bottom: tabHeight,
        },
      ]}
    >
      <View className="flex-row items-center justify-between py-2" style={{ paddingHorizontal }}>
        {views.map((view) => (
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setCurrentView(view.view)}
            key={view.name}
            className="items-center justify-center"
            style={{ width: scaleWidth((375 - paddingHorizontal * 2) / views.length) }}
          >
            <view.icon
              color={currentView === view.view ? view.activeColor : "gray"}
              height={18}
              width={22}
            />
            <Text
              style={{ color: currentView === view.view ? view.activeColor : "gray" }}
              className="text-xs"
            >
              {view.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ThemedBlurView>
  )
}

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

const SubscriptionList = () => {
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
      <Text>{currentView}</Text>
      <Text>{subscriptionIds.length}</Text>
      {subscriptionIds.map((id) => {
        return (
          <Text key={id} id={id}>
            {id}
          </Text>
        )
      })}
      {subscriptionIds.map((id) => {
        return <SubscriptionItem key={id} id={id} />
      })}
    </View>
  )
}

const SubscriptionItem = memo(({ id }: { id: string }) => {
  const subscription = useSubscription(id)
  const feed = useFeed(id)
  if (!subscription || !feed) return null
  return (
    <TouchableOpacity>
      <Text>{subscription.title || feed.title}</Text>
    </TouchableOpacity>
  )
})

const styles = StyleSheet.create({
  tabContainer: {
    bottom: 0,
    left: 0,
    position: "absolute",
    width: "100%",
    borderTopColor: "rgba(0,0,0,0.2)",
    borderTopWidth: StyleSheet.hairlineWidth,
    height: bottomViewTabHeight,
  },
})
