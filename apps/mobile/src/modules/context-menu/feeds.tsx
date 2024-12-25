// TODO: implement logic
import type { FeedViewType } from "@follow/constants"
import type { FC, PropsWithChildren } from "react"
import { useMemo } from "react"
import type { NativeSyntheticEvent } from "react-native"
import { Alert } from "react-native"
import type {
  ContextMenuAction,
  ContextMenuOnPressNativeEvent,
} from "react-native-context-menu-view"
import { useEventCallback } from "usehooks-ts"

import { ContextMenu } from "@/src/components/ui/context-menu"
import { getSubscription } from "@/src/store/subscription/getter"
import { useListSubscriptionCategory } from "@/src/store/subscription/hooks"
import { subscriptionSyncService } from "@/src/store/subscription/store"
import { unreadSyncService } from "@/src/store/unread/store"

type Options = {
  categories: string[]
}
const createActions: (options: Options) => ContextMenuAction[] = (options) => {
  return [
    {
      title: "Mark All As Read",
    },
    {
      title: "Claim",
    },
    {
      title: "Boost",
    },
    {
      title: "Add To Category",
      actions: [
        ...options.categories.map((category) => ({
          title: category,
        })),
        {
          title: "Create New Category",
          systemIcon: "plus",
        },
      ],
    },
    {
      title: "Edit",
    },
    {
      title: "Copy Link",
    },
    {
      title: "Unsubscribe",
      destructive: true,
    },
  ]
}
export const SubscriptionItemContextMenu: FC<
  PropsWithChildren & {
    id: string
    view: FeedViewType
  }
> = ({ id, children, view }) => {
  const allCategories = useListSubscriptionCategory(view)
  const actions = useMemo(() => createActions({ categories: allCategories }), [allCategories])

  return (
    <ContextMenu
      actions={actions}
      onPress={useEventCallback((e: NativeSyntheticEvent<ContextMenuOnPressNativeEvent>) => {
        const [first, second] = e.nativeEvent.indexPath

        switch (first) {
          case 0: {
            unreadSyncService.markAsRead(id)
            break
          }
          case 1: {
            break
          }
          case 2: {
            break
          }
          case 3: {
            // add to category

            if (!actions[3].actions) break
            const newCategory = second === actions[3].actions.length - 1
            const subscription = getSubscription(id)

            if (!subscription) return
            if (newCategory) {
              // create new category
              Alert.prompt("Create New Category", "Enter the name of the new category", (text) => {
                subscriptionSyncService.edit({
                  ...subscription,
                  category: text,
                })
              })
            } else {
              // add to category
              subscriptionSyncService.edit({
                ...subscription,
                category: actions[3].actions[second].title,
              })
            }

            break
          }
        }
      })}
    >
      {children}
    </ContextMenu>
  )
}
