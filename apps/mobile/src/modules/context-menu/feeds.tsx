import { FeedViewType } from "@follow/constants"
import type { FC, PropsWithChildren } from "react"
import { useMemo } from "react"
import { Alert, Clipboard } from "react-native"

import { ContextMenu } from "@/src/components/ui/context-menu"
import type { IContextMenuItemConfig } from "@/src/components/ui/context-menu/types"
import { views } from "@/src/constants/views"
import { getFeed } from "@/src/store/feed/getter"
import { getSubscription } from "@/src/store/subscription/getter"
import { useListSubscriptionCategory } from "@/src/store/subscription/hooks"
import { subscriptionSyncService } from "@/src/store/subscription/store"
import { unreadSyncService } from "@/src/store/unread/store"

enum FeedItemActionKey {
  MARK_ALL_AS_READ = "markAllAsRead",
  CLAIM = "claim",
  BOOST = "boost",
  ADD_TO_CATEGORY = "addToCategory",
  CREATE_NEW_CATEGORY = "createNewCategory",
  EDIT = "edit",
  COPY_LINK = "copyLink",
  UNSUBSCRIBE = "unsubscribe",

  CHANGE_TO_OTHER_VIEW = "changeToOtherView",

  DELETE = "delete",
}

enum ChangeToOtherViewActionKey {
  ARTICLE = "article",
  SOCIAL = "social",
  PICTURE = "picture",
  VIDEO = "video",
  NOTIFICATION = "notification",
  AUDIO = "audio",
}
const changeViewActionKeyMapping: Record<FeedViewType, ChangeToOtherViewActionKey> = {
  [FeedViewType.Articles]: ChangeToOtherViewActionKey.ARTICLE,
  [FeedViewType.SocialMedia]: ChangeToOtherViewActionKey.SOCIAL,
  [FeedViewType.Pictures]: ChangeToOtherViewActionKey.PICTURE,
  [FeedViewType.Videos]: ChangeToOtherViewActionKey.VIDEO,
  [FeedViewType.Notifications]: ChangeToOtherViewActionKey.NOTIFICATION,
  [FeedViewType.Audios]: ChangeToOtherViewActionKey.AUDIO,
} as const
type Options = {
  categories: string[]
}
const createFeedItemActions: (options: Options) => IContextMenuItemConfig[] = (options) => {
  return [
    {
      title: "Mark All As Read",
      actionKey: FeedItemActionKey.MARK_ALL_AS_READ,
    },
    {
      title: "Claim",
      actionKey: FeedItemActionKey.CLAIM,
    },
    {
      title: "Boost",
      actionKey: FeedItemActionKey.BOOST,
    },
    {
      title: "Add To Category",
      actionKey: FeedItemActionKey.ADD_TO_CATEGORY,
      subMenu: {
        title: "Add To Category",
        items: [
          ...options.categories.map((category) => ({
            title: category,
            actionKey: `${FeedItemActionKey.ADD_TO_CATEGORY}:${category}`,
          })),
          {
            title: "Create New Category",
            actionKey: FeedItemActionKey.CREATE_NEW_CATEGORY,

            systemIcon: "plus",
          },
        ],
      },
    },
    {
      title: "Edit",
      actionKey: FeedItemActionKey.EDIT,
    },
    {
      title: "Copy Link",
      actionKey: FeedItemActionKey.COPY_LINK,
    },
    {
      title: "Unsubscribe",
      actionKey: FeedItemActionKey.UNSUBSCRIBE,
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
      config={{
        items: actions,
      }}
      onPressMenuItem={(item) => {
        switch (item.actionKey) {
          case FeedItemActionKey.MARK_ALL_AS_READ: {
            unreadSyncService.markAsRead(id)
            break
          }
          case FeedItemActionKey.CREATE_NEW_CATEGORY: {
            // create new category
            const subscription = getSubscription(id)
            if (!subscription) return
            Alert.prompt("Create New Category", "Enter the name of the new category", (text) => {
              subscriptionSyncService.edit({
                ...subscription,
                category: text,
              })
            })
            break
          }
          case FeedItemActionKey.CLAIM: {
            // TODO: implement logic
            break
          }
          case FeedItemActionKey.BOOST: {
            // TODO: implement logic
            break
          }
          case FeedItemActionKey.COPY_LINK: {
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
          case FeedItemActionKey.UNSUBSCRIBE: {
            // unsubscribe
            Alert.alert("Unsubscribe?", "This will remove the feed from your subscriptions", [
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

        if (item.actionKey.startsWith(FeedItemActionKey.ADD_TO_CATEGORY)) {
          const category = item.actionKey.split(":")[1]
          if (!category) return

          const subscription = getSubscription(id)

          if (!subscription) return

          // add to category
          subscriptionSyncService.edit({
            ...subscription,
            category,
          })
        }
      }}
    >
      {children}
    </ContextMenu>
  )
}

export const SubscriptionFeedCategoryContextMenu: FC<
  {
    category: string
    feedIds: string[]
    view: FeedViewType
  } & PropsWithChildren
> = ({ category: _, feedIds, view: currentView, children }) => {
  return (
    <ContextMenu
      config={{
        items: [
          {
            title: "Mark All As Read",
            actionKey: FeedItemActionKey.MARK_ALL_AS_READ,
          },
          {
            title: "Change To Other View",
            actionKey: FeedItemActionKey.CHANGE_TO_OTHER_VIEW,
            subMenu: {
              title: "Change To Other View",
              items: views.map((view) => ({
                title: view.name,
                actionKey: changeViewActionKeyMapping[view.view],
                checked: view.view === currentView,
              })),
            },
          },
          {
            title: "Edit Category",
            actionKey: FeedItemActionKey.EDIT,
          },
          {
            title: "Delete Category",
            actionKey: FeedItemActionKey.DELETE,
            destructive: true,
          },
        ],
      }}
      onPressMenuItem={(item) => {
        switch (item.actionKey) {
          case FeedItemActionKey.MARK_ALL_AS_READ: {
            unreadSyncService.markAsReadMany(feedIds)
            break
          }
          case ChangeToOtherViewActionKey.ARTICLE: {
            // TODO: change to article view
            break
          }
          case ChangeToOtherViewActionKey.SOCIAL: {
            // TODO: change to social view
            break
          }
          case ChangeToOtherViewActionKey.PICTURE: {
            // TODO: change to picture view
            break
          }
          case ChangeToOtherViewActionKey.VIDEO: {
            // TODO: change to video view
            break
          }
          case ChangeToOtherViewActionKey.NOTIFICATION: {
            // TODO: change to notification view
            break
          }
          case ChangeToOtherViewActionKey.AUDIO: {
            // TODO: change to audio view
            break
          }
          case FeedItemActionKey.EDIT: {
            // TODO: edit category
            break
          }
          case FeedItemActionKey.DELETE: {
            // TODO: delete category
            break
          }
        }
      }}
    >
      {children}
    </ContextMenu>
  )
}
