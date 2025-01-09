import { Link, Stack } from "expo-router"
import { Text, TouchableOpacity, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { views } from "@/src/constants/views"
import { AddCuteReIcon } from "@/src/icons/add_cute_re"
import { useCurrentView } from "@/src/modules/subscription/atoms"
import { SortActionButton } from "@/src/modules/subscription/header-actions"
import { SubscriptionLists } from "@/src/modules/subscription/SubscriptionLists"
import { usePrefetchUnread } from "@/src/store/unread/hooks"
import { accentColor } from "@/src/theme/colors"

import { ViewTab } from "../../../modules/subscription/ViewTab"

export default function FeedList() {
  const currentView = useCurrentView()
  usePrefetchUnread()
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

      <SubscriptionLists />
      <ViewTab />
    </>
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
