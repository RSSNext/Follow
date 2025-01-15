import { Image, Text, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { useWhoami } from "@/src/store/user/hooks"

export const UserHeaderBanner = () => {
  const whoami = useWhoami()
  const insets = useSafeAreaInsets()

  if (!whoami) return null
  return (
    <View className="h-[200px] items-center justify-center" style={{ marginTop: -insets.top }}>
      <View
        className="bg-system-background overflow-hidden rounded-full"
        style={{ marginTop: insets.top }}
      >
        {!!whoami.image && (
          <Image source={{ uri: whoami.image, height: 60, width: 60 }} resizeMode="cover" />
        )}
      </View>

      <View className="mt-2">
        <Text className="text-2xl font-bold">{whoami.name}</Text>
        {!!whoami.handle && <Text className="text-secondary-label">@{whoami.handle}</Text>}
      </View>
    </View>
  )
}
