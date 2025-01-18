import { Link, Stack } from "expo-router"
import { useEffect } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { BlurEffect } from "@/src/components/common/HeaderBlur"
import { SafeNavigationScrollView } from "@/src/components/common/SafeNavigationScrollView"
import { views } from "@/src/constants/views"
import { AddCuteReIcon } from "@/src/icons/add_cute_re"
import { LayoutLeftbarOpenCuteReIcon } from "@/src/icons/layout_leftbar_open_cute_re"
import { useFeedDrawer, useSetDrawerSwipeDisabled } from "@/src/modules/feed-drawer/atoms"
import { useCurrentView } from "@/src/modules/subscription/atoms"
import { usePrefetchUnread } from "@/src/store/unread/hooks"
import { accentColor } from "@/src/theme/colors"

export default function Index() {
  const currentView = useCurrentView()
  usePrefetchUnread()

  const setDrawerSwipeDisabled = useSetDrawerSwipeDisabled()
  useEffect(() => {
    setDrawerSwipeDisabled(false)
    return () => {
      setDrawerSwipeDisabled(true)
    }
  }, [setDrawerSwipeDisabled])
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: views[currentView]!.name,
          headerLeft: LeftAction,
          headerRight: RightAction,
          headerTransparent: true,
          headerBackground: BlurEffect,
        }}
      />

      <SafeNavigationScrollView>
        <View className="flex min-h-96 items-center justify-center bg-zinc-300">
          <Text className="text-center text-2xl text-accent">EntryList Placeholder</Text>
        </View>
      </SafeNavigationScrollView>
    </>
  )
}

const useActionPadding = () => {
  const insets = useSafeAreaInsets()
  return { paddingLeft: insets.left + 12, paddingRight: insets.right + 12 }
}

function LeftAction() {
  const { openDrawer } = useFeedDrawer()

  const insets = useActionPadding()

  return (
    <TouchableOpacity onPress={openDrawer} style={{ paddingLeft: insets.paddingLeft }}>
      <LayoutLeftbarOpenCuteReIcon color={accentColor} />
    </TouchableOpacity>
  )
}

function RightAction() {
  const insets = useActionPadding()

  return (
    <View className="flex-row items-center gap-4" style={{ paddingRight: insets.paddingRight }}>
      <Link asChild href="/add">
        <TouchableOpacity className="size-6">
          <AddCuteReIcon color={accentColor} />
        </TouchableOpacity>
      </Link>
    </View>
  )
}
