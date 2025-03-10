import { Text, View } from "react-native"
import { useColor } from "react-native-uikit-colors"

import { Logo } from "../ui/logo"

export function NoLoginInfo({ target }: { target: "timeline" | "subscriptions" }) {
  const color = useColor("secondaryLabel")

  return (
    <View className="flex-1 items-center justify-center gap-3">
      <Logo width={40} height={40} color={color} />
      <Text className="text-secondary-label text-xl">{`Sign in to see your ${target}`}</Text>
    </View>
  )
}
