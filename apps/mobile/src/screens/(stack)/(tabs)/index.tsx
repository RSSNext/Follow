import { Link, Stack } from "expo-router"
import { useEffect } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { SafeNavigationScrollView } from "@/src/components/common/SafeNavigationScrollView"
import { views } from "@/src/constants/views"
import { AddCuteReIcon } from "@/src/icons/add_cute_re"
import { useFeedDrawer, useSetDrawerSwipeDisabled } from "@/src/modules/feed-drawer/atoms"
import { useCurrentView } from "@/src/modules/subscription/atoms"
import { SortActionButton } from "@/src/modules/subscription/header-actions"
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
          title: views[currentView].name,
          headerLeft: LeftAction,
          headerRight: RightAction,
          headerTransparent: true,
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
  const handleEdit = () => {
    openDrawer()
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
    <View className="flex-row items-center gap-4" style={{ paddingRight: insets.paddingRight }}>
      <SortActionButton />
      <Link asChild href="/add">
        <TouchableOpacity className="size-6">
          <AddCuteReIcon color={accentColor} />
        </TouchableOpacity>
      </Link>
    </View>
  )
}
