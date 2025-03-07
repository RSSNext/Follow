import { router } from "expo-router"
import { useColorScheme } from "nativewind"
import { memo } from "react"
import { Text, View } from "react-native"
import Animated, { FadeOutUp } from "react-native-reanimated"

import { ItemPressable } from "@/src/components/ui/pressable/ItemPressable"
import { InboxCuteFiIcon } from "@/src/icons/inbox_cute_fi"
import { selectFeed } from "@/src/modules/screen/atoms"
import { useSubscription } from "@/src/store/subscription/hooks"
import { getInboxStoreId } from "@/src/store/subscription/utils"
import { useUnreadCount } from "@/src/store/unread/hooks"

import { UnreadCount } from "./UnreadCount"

export const InboxItem = memo(({ id }: { id: string }) => {
  const subscription = useSubscription(getInboxStoreId(id))
  const unreadCount = useUnreadCount(id)
  const { colorScheme } = useColorScheme()
  if (!subscription) return null
  return (
    <Animated.View exiting={FadeOutUp}>
      <ItemPressable
        className="h-12 flex-row items-center px-3"
        onPress={() => {
          selectFeed({ type: "inbox", inboxId: id })
          router.push(`/feeds/${id}`)
        }}
      >
        <View className="ml-0.5 overflow-hidden rounded">
          <InboxCuteFiIcon
            height={20}
            width={20}
            color={colorScheme === "dark" ? "white" : "black"}
          />
        </View>

        <Text className="text-text ml-2.5">{subscription.title}</Text>
        <UnreadCount unread={unreadCount} className="ml-auto" />
      </ItemPressable>
    </Animated.View>
  )
})
