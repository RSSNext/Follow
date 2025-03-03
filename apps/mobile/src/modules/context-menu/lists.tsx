import { env } from "@follow/shared/src/env"
import type { FC, PropsWithChildren } from "react"
import { useMemo } from "react"
import { Alert, Clipboard } from "react-native"

import { ContextMenu } from "@/src/components/ui/context-menu"
import { toast } from "@/src/lib/toast"
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
    () => [
      isOwnList && {
        title: "Edit",
        onSelect: () => {
          const list = getList(id)
          if (!list) return
          // TODO
        },
      },
      {
        title: "Copy Link",
        onSelect: () => {
          const list = getList(id)
          if (!list) return
          toast.info("Link copied to clipboard")
          Clipboard.setString(`${env.VITE_WEB_URL}/share/lists/${list.id}`)
        },
      },
      {
        title: "Unsubscribe",
        destructive: true,
        onSelect: () => {
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
        },
      },
    ],
    [id, isOwnList],
  )

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger>{children}</ContextMenu.Trigger>

      <ContextMenu.Content>
        {actions
          .filter((i) => !!i)
          .map((action) => {
            return (
              <ContextMenu.Item
                key={action.title}
                destructive={action.destructive}
                onSelect={action.onSelect}
              >
                <ContextMenu.ItemTitle>{action.title}</ContextMenu.ItemTitle>
              </ContextMenu.Item>
            )
          })}
      </ContextMenu.Content>
    </ContextMenu.Root>
  )
}
