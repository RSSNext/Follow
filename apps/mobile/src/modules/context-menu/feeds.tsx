import type { FeedViewType } from "@follow/constants"
import type { FC, PropsWithChildren } from "react"
import { useCallback, useMemo } from "react"
import type { NativeSyntheticEvent } from "react-native"
import { Alert, Clipboard } from "react-native"
import type {
  ContextMenuAction,
  ContextMenuOnPressNativeEvent,
} from "react-native-context-menu-view"
import { useEventCallback } from "usehooks-ts"

import { ContextMenu } from "@/src/components/ui/context-menu"
import { views } from "@/src/constants/views"
import { getFeed } from "@/src/store/feed/getter"
import { getSubscription } from "@/src/store/subscription/getter"
import { useListSubscriptionCategory } from "@/src/store/subscription/hooks"
import { subscriptionSyncService } from "@/src/store/subscription/store"
import { unreadSyncService } from "@/src/store/unread/store"

type Options = {
  categories: string[]
}
const createFeedItemActions: (options: Options) => ContextMenuAction[] = (options) => {
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
export const SubscriptionFeedItemContextMenu: FC<
  PropsWithChildren & {
    id: string
    view: FeedViewType
  }
> = ({ id, children, view }) => {
  const allCategories = useListSubscriptionCategory(view)
  const actions = useMemo(
    () => createFeedItemActions({ categories: allCategories }),
    [allCategories],
  )

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
            // TODO: implement logic
            break
          }
          case 2: {
            // TODO: implement logic
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
          case 4: {
            // edit
            break
          }
          case 5: {
            // copy link
            const subscription = getSubscription(id)
            if (!subscription) return

            switch (subscription.type) {
              case "feed": {
                if (!subscription.feedId) return
                const feed = getFeed(subscription.feedId)
                if (!feed) return
                Clipboard.setString(feed.url)
                return
              }
            }
            break
          }

          case 6: {
            // unsubscribe
            Alert.alert("Unsubscribe?", "This will remove the feed from your list", [
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

export const SubscriptionFeedCategoryContextMenu: FC<
  {
    category: string
    feedIds: string[]
  } & PropsWithChildren
> = ({ category: _, feedIds, children }) => {
  return (
    <ContextMenu
      actions={useMemo(
        () => [
          {
            title: "Mark All As Read",
          },
          {
            title: "Change To Other View",
            actions: views.map((view) => ({
              title: view.name,
            })),
          },
          {
            title: "Edit Category",
          },
          {
            title: "Delete Category",
            destructive: true,
          },
        ],
        [],
      )}
      onPress={useCallback(
        (e: NativeSyntheticEvent<ContextMenuOnPressNativeEvent>) => {
          const { name } = e.nativeEvent
          const [first, second] = e.nativeEvent.indexPath

          if (first === 1) {
            void second
            // TODO change to other view
            return
          }
          switch (name) {
            case "Mark All As Read": {
              unreadSyncService.markAsReadMany(feedIds)
              break
            }
            case "Change To Other View": {
              // TODO: implement logic
              break
            }

            case "Delete Category": {
              // TODO: implement logic
              break
            }
          }
        },
        [feedIds],
      )}
    >
      {children}
    </ContextMenu>
  )
}
