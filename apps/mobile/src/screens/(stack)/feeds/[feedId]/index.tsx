import { Stack, useLocalSearchParams } from "expo-router"
import { ScrollView, Text, View } from "react-native"

import { HeaderBlur } from "@/src/components/common/HeaderBlur"

export default function Feed() {
  const { feedId } = useLocalSearchParams()

  return (
    <View>
      <Stack.Screen
        options={{
          headerShown: true,
          headerBackTitle: "Subscriptions",
          headerBackground: HeaderBlur,

          headerTransparent: true,
          headerTitle: "Feed",
        }}
      />
      <ScrollView contentInsetAdjustmentBehavior="automatic" className="h-full">
        <Text>Feed {feedId}</Text>
        <Text>Feed {feedId}</Text>
        <Text>Feed {feedId}</Text>
        <Text>Feed {feedId}</Text>
        <Text>Feed {feedId}</Text>
        <Text>Feed {feedId}</Text>
        <Text>Feed {feedId}</Text>
        <Text>Feed {feedId}</Text>
        <Text>Feed {feedId}</Text>
        <Text>Feed {feedId}</Text>
        <Text>Feed {feedId}</Text>
        <Text>Feed {feedId}</Text>
      </ScrollView>
    </View>
  )
}
