import { Link, Stack } from "expo-router"
import { Text, TouchableOpacity, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { HeaderBlur } from "@/src/components/common/HeaderBlur"
import { views } from "@/src/constants/views"
import { AddCuteReIcon } from "@/src/icons/add_cute_re"
import { useCurrentView } from "@/src/modules/feed-list/atoms"
import { SubscriptionList } from "@/src/modules/feed-list/list"
import { accentColor } from "@/src/theme/colors"

import { ViewTab } from "../../../modules/feed-list/ViewTab"

export default function FeedList() {
  const currentView = useCurrentView()
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: views[currentView].name,
          headerLeft: LeftAction,
          headerRight: RightAction,
          headerBackground: HeaderBlur,

          headerTransparent: true,
        }}
      />
      <SubscriptionList />
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
    <View className="flex-row items-center" style={{ paddingRight: insets.paddingRight }}>
      <Link asChild href="/add">
        <TouchableOpacity>
          <AddCuteReIcon color={accentColor} />
        </TouchableOpacity>
      </Link>
    </View>
  )
}
