import { FeedViewType } from "@follow/constants"
import { Link, Stack } from "expo-router"
import { atom, useAtom, useAtomValue } from "jotai"
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { useBottomTabBarHeight } from "react-native-bottom-tabs"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { ThemedBlurView } from "@/src/components/common/ThemedBlurView"
import { views } from "@/src/constants/views"
import { AddCuteReIcon } from "@/src/icons/add_cute_re"
import { useScaleWidth } from "@/src/lib/responsive"
import { accentColor } from "@/src/theme/colors"

const viewAtom = atom<FeedViewType>(FeedViewType.Articles)
export default function FeedList() {
  return (
    <>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <Stack.Screen
          options={{
            headerShown: true,
            title: "Subscriptions",
            headerLeft: LeftAction,
            headerRight: RightAction,
            headerBackground: () => <ThemedBlurView intensity={100} />,
          }}
        />

        <SubscriptionList />
      </ScrollView>
      <ViewTab />
    </>
  )
}

const ViewTab = () => {
  const scaleWidth = useScaleWidth()
  const bottomHeight = useBottomTabBarHeight()

  const paddingHorizontal = 4
  const [currentView, setCurrentView] = useAtom(viewAtom)

  return (
    <ThemedBlurView
      style={{
        bottom: bottomHeight,
        left: 0,
        position: "absolute",
        width: "100%",
        borderTopColor: "rgba(0,0,0,0.2)",
        borderTopWidth: StyleSheet.hairlineWidth,
      }}
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
  return (
    <View>
      <Text>{currentView}</Text>
    </View>
  )
}
