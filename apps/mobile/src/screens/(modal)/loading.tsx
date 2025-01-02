import { router } from "expo-router"
import { Text, TouchableOpacity, View } from "react-native"

export default function Loading() {
  return (
    <View className="flex-1 items-center justify-center bg-transparent">
      <TouchableOpacity onPress={() => router.back()}>
        <Text className="text-text">Loading...</Text>
      </TouchableOpacity>
    </View>
  )
}
