import type { FC, PropsWithChildren } from "react"
import { useMemo } from "react"
import { Alert, Clipboard } from "react-native"

import { ContextMenu } from "@/src/components/ui/context-menu"
import type { NullableContextMenuItemConfig } from "@/src/components/ui/context-menu/types"
import { getWebUrl } from "@/src/lib/env"
import { toast } from "@/src/lib/toast"
import { getList } from "@/src/store/list/getters"
import { useIsOwnList } from "@/src/store/list/hooks"
import { subscriptionSyncService } from "@/src/store/subscription/store"

enum ListItemActionKey {
  EDIT = "edit",
  COPY_LINK = "copyLink",
  UNSUBSCRIBE = "unsubscribe",
}
export const SubscriptionListItemContextMenu: FC<
  PropsWithChildren & {
    id: string
  }
> = ({ id, children }) => {
  const isOwnList = useIsOwnList(id)
  const actions = useMemo(
    (): NullableContextMenuItemConfig[] => [
      isOwnList && {
        title: "Edit",
        actionKey: ListItemActionKey.EDIT,
      },
      {
        title: "Copy Link",
        actionKey: ListItemActionKey.COPY_LINK,
      },
      {
        title: "Unsubscribe",
        actionKey: ListItemActionKey.UNSUBSCRIBE,
        destructive: true,
      },
    ],
    [isOwnList],
  )
  return (
    <ContextMenu
      config={{ items: actions }}
      onPressMenuItem={(item) => {
        switch (item.actionKey) {
          case ListItemActionKey.EDIT: {
            // TODO: implement
            break
          }
          case ListItemActionKey.COPY_LINK: {
            const list = getList(id)
            if (!list) return
            toast.info("Link copied to clipboard")
            Clipboard.setString(`${getWebUrl()}/share/lists/${list.id}`)
            break
          }
          case ListItemActionKey.UNSUBSCRIBE: {
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
      }}
    >
      {children}
    </ContextMenu>
  )
}
