import { Text, View } from "react-native"

import { useUISettingKey } from "@/src/atoms/settings/ui"

export function UnreadCount({ unread }: { unread?: number }) {
  const showUnreadCount = useUISettingKey("subscriptionShowUnreadCount")

  if (!unread) return null
  return showUnreadCount ? (
    <Text className="text-tertiary-label ml-auto pl-2 text-xs">{unread}</Text>
  ) : (
    <View className="bg-tertiary-label ml-auto size-1 rounded-full" />
  )
}
