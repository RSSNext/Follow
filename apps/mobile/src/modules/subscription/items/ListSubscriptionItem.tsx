import { router } from "expo-router"
import { memo } from "react"
import { Text, View } from "react-native"
import Animated, { FadeOutUp } from "react-native-reanimated"

import { FallbackIcon } from "@/src/components/ui/icon/fallback-icon"
import { ProxiedImage } from "@/src/components/ui/image/ProxiedImage"
import { ItemPressable } from "@/src/components/ui/pressable/ItemPressable"
import { useList } from "@/src/store/list/hooks"
import { useListUnreadCount } from "@/src/store/unread/hooks"

import { SubscriptionListItemContextMenu } from "../../context-menu/lists"
import { selectFeed } from "../../screen/atoms"
import { UnreadCount } from "./UnreadCount"

export const ListSubscriptionItem = memo(({ id }: { id: string; className?: string }) => {
  const list = useList(id)
  const unreadCount = useListUnreadCount(id)
  if (!list) return null
  return (
    <Animated.View exiting={FadeOutUp}>
      <SubscriptionListItemContextMenu id={id}>
        <ItemPressable
          className="h-12 flex-row items-center px-3"
          onPress={() => {
            selectFeed({
              type: "list",
              listId: id,
            })
            router.push(`/feeds/${id}`)
          }}
        >
          <View className="overflow-hidden rounded">
            {!!list.image && (
              <ProxiedImage
                proxy={{
                  width: 20,
                  height: 20,
                }}
                style={{ height: 20, width: 20 }}
                source={list.image}
              />
            )}
            {!list.image && <FallbackIcon title={list.title} size={20} />}
          </View>

          <Text className="text-text ml-2">{list.title}</Text>
          <UnreadCount unread={unreadCount} className="ml-auto" />
        </ItemPressable>
      </SubscriptionListItemContextMenu>
    </Animated.View>
  )
})
