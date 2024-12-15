import { Link, Stack } from "expo-router"
import { ScrollView, Text, TouchableOpacity, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { AddCuteReIcon } from "@/src/icons/add_cute_re"
import { accentColor } from "@/src/theme/colors"

export default function FeedList() {
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Subscriptions",
          headerLeft: LeftAction,
          headerRight: RightAction,
        }}
      />

      <Text>Feed</Text>
    </ScrollView>
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
