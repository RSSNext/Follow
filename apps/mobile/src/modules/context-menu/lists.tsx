import type { FC, PropsWithChildren } from "react"
import { useMemo } from "react"
import type { NativeSyntheticEvent } from "react-native"
import { Alert, Clipboard } from "react-native"
import type {
  ContextMenuAction,
  ContextMenuOnPressNativeEvent,
} from "react-native-context-menu-view"
import { useEventCallback } from "usehooks-ts"

import { ContextMenu } from "@/src/components/ui/context-menu"
import { getWebUrl } from "@/src/lib/env"
import { getList } from "@/src/store/list/getters"
import { useIsOwnList } from "@/src/store/list/hooks"
import { subscriptionSyncService } from "@/src/store/subscription/store"

export const SubscriptionListItemContextMenu: FC<
  PropsWithChildren & {
    id: string
  }
> = ({ id, children }) => {
  const isOwnList = useIsOwnList(id)
  const actions = useMemo(
    () =>
      [
        isOwnList && {
          title: "Edit",
        },
        {
          title: "Copy Link",
        },
        {
          title: "Unsubscribe",
          destructive: true,
        },
      ].filter(Boolean) as ContextMenuAction[],
    [isOwnList],
  )
  return (
    <ContextMenu
      actions={actions}
      onPress={useEventCallback((e: NativeSyntheticEvent<ContextMenuOnPressNativeEvent>) => {
        const { name } = e.nativeEvent

        switch (name) {
          case "Edit": {
            // TODO: implement
            break
          }
          case "Copy Link": {
            const list = getList(id)
            if (!list) return
            Clipboard.setString(`${getWebUrl()}/share/lists/${list.id}`)
            break
          }
          case "Unsubscribe": {
            Alert.alert("Unsubscribe", "Are you sure you want to unsubscribe?", [
              {
                text: "Cancel",
                style: "cancel",
              },
              {
                text: "Unsubscribe",
                style: "destructive",
                onPress: () => {
                  subscriptionSyncService.unsubscribe(id)
                },
              },
            ])
            break
          }
        }
      })}
    >
      {children}
    </ContextMenu>
  )
}
