import { useLocalSearchParams } from "expo-router"
import { Text, View } from "react-native"

export default function Follow() {
  const { url } = useLocalSearchParams()
  return (
    <View>
      <Text className="text-text">{url}</Text>
    </View>
  )
}
