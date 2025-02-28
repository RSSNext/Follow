import type { FeedViewType } from "@follow/constants"
import type { FC, PropsWithChildren } from "react"
import { useCallback } from "react"
import { Alert, Clipboard } from "react-native"

import { ContextMenu } from "@/src/components/ui/context-menu"
import { views } from "@/src/constants/views"
import { toast } from "@/src/lib/toast"
import { getFeed } from "@/src/store/feed/getter"
import { getSubscription } from "@/src/store/subscription/getter"
import { useSubscriptionCategory } from "@/src/store/subscription/hooks"
import { subscriptionSyncService } from "@/src/store/subscription/store"
import { unreadSyncService } from "@/src/store/unread/store"

export const SubscriptionFeedItemContextMenu: FC<
  PropsWithChildren & {
    id: string
    view?: FeedViewType
  }
> = ({ id, children, view }) => {
  const allCategories = useSubscriptionCategory(view)

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger>{children}</ContextMenu.Trigger>

      <ContextMenu.Content>
        <ContextMenu.Item
          key="MarkAllAsRead"
          onSelect={useCallback(() => {
            unreadSyncService.markFeedAsRead(id)
          }, [id])}
        >
          <ContextMenu.ItemTitle>Mark All As Read</ContextMenu.ItemTitle>
          <ContextMenu.ItemIcon
            ios={{
              name: "checklist.checked",
            }}
          />
        </ContextMenu.Item>

        <ContextMenu.Item key="Claim">
          <ContextMenu.ItemTitle>Claim</ContextMenu.ItemTitle>
          <ContextMenu.ItemIcon
            ios={{
              name: "checkmark.seal",
            }}
          />
        </ContextMenu.Item>

        <ContextMenu.Item key="Boost">
          <ContextMenu.ItemTitle>Boost</ContextMenu.ItemTitle>
          <ContextMenu.ItemIcon
            ios={{
              name: "bolt",
            }}
          />
        </ContextMenu.Item>

        <ContextMenu.Sub key="AddToCategory">
          <ContextMenu.SubTrigger key="SubTrigger/AddToCategory">
            <ContextMenu.ItemTitle>Add To Category</ContextMenu.ItemTitle>
          </ContextMenu.SubTrigger>

          <ContextMenu.SubContent>
            <>
              {allCategories.map((category) => {
                const onSelect = () => {
                  const subscription = getSubscription(id)
                  if (!subscription) return

                  // add to category
                  subscriptionSyncService.edit({
                    ...subscription,
                    category,
                  })
                }
                return (
                  <ContextMenu.Item key={`SubContent/${category}`} onSelect={onSelect}>
                    <ContextMenu.ItemTitle>{category}</ContextMenu.ItemTitle>
                  </ContextMenu.Item>
                )
              })}
            </>
            <ContextMenu.Item
              key={`SubContent/CreateNewCategory`}
              onSelect={useCallback(() => {
                // create new category
                const subscription = getSubscription(id)
                if (!subscription) return
                Alert.prompt(
                  "Create New Category",
                  "Enter the name of the new category",
                  (text) => {
                    subscriptionSyncService.edit({
                      ...subscription,
                      category: text,
                    })
                  },
                )
              }, [id])}
            >
              <ContextMenu.ItemTitle>Create New Category</ContextMenu.ItemTitle>
              <ContextMenu.ItemIcon ios={{ name: "plus" }} />
            </ContextMenu.Item>
          </ContextMenu.SubContent>
        </ContextMenu.Sub>

        <ContextMenu.Item key="Edit">
          <ContextMenu.ItemTitle>Edit</ContextMenu.ItemTitle>
          <ContextMenu.ItemIcon
            ios={{
              name: "square.and.pencil",
            }}
          />
        </ContextMenu.Item>

        <ContextMenu.Item
          key="CopyLink"
          onSelect={useCallback(() => {
            const subscription = getSubscription(id)
            if (!subscription) return

            switch (subscription.type) {
              case "feed": {
                if (!subscription.feedId) return
                const feed = getFeed(subscription.feedId)
                if (!feed) return
                Clipboard.setString(feed.url)
                toast.info("Link copied to clipboard")
                return
              }
            }
          }, [id])}
        >
          <ContextMenu.ItemTitle>Copy Link</ContextMenu.ItemTitle>
          <ContextMenu.ItemIcon
            ios={{
              name: "link",
            }}
          />
        </ContextMenu.Item>

        <ContextMenu.Item
          key="Unsubscribe"
          destructive
          onSelect={useCallback(() => {
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
          }, [id])}
        >
          <ContextMenu.ItemTitle>Unsubscribe</ContextMenu.ItemTitle>
          <ContextMenu.ItemIcon
            ios={{
              name: "xmark",
            }}
          />
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  )
}

export const SubscriptionFeedCategoryContextMenu = ({
  category: _,
  feedIds,
  view: currentView,
  children,
}: PropsWithChildren<{
  category: string
  feedIds: string[]
  view: FeedViewType
}>) => {
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger>{children}</ContextMenu.Trigger>

      <ContextMenu.Content>
        <ContextMenu.Item
          key="MarkAllAsRead"
          onSelect={useCallback(() => {
            unreadSyncService.markFeedAsRead(feedIds)
          }, [feedIds])}
        >
          <ContextMenu.ItemTitle>Mark All As Read</ContextMenu.ItemTitle>
          <ContextMenu.ItemIcon
            ios={{
              name: "checklist.checked",
            }}
          />
        </ContextMenu.Item>

        <ContextMenu.Sub key="ChangeToOtherView">
          <ContextMenu.SubTrigger key="SubTrigger/ChangeToOtherView">
            <ContextMenu.ItemTitle>Change To Other View</ContextMenu.ItemTitle>
          </ContextMenu.SubTrigger>

          <ContextMenu.SubContent>
            {views.map((view) => {
              const isSelected = view.view === currentView
              return (
                <ContextMenu.CheckboxItem
                  key={`SubContent/${view.name}`}
                  value={isSelected}
                  // onSelect={onSelect}
                >
                  <ContextMenu.ItemTitle>{view.name}</ContextMenu.ItemTitle>
                </ContextMenu.CheckboxItem>
              )
            })}
          </ContextMenu.SubContent>
        </ContextMenu.Sub>

        <ContextMenu.Item key="EditCategory">
          <ContextMenu.ItemTitle>Edit Category</ContextMenu.ItemTitle>
          <ContextMenu.ItemIcon
            ios={{
              name: "square.and.pencil",
            }}
          />
        </ContextMenu.Item>
        <ContextMenu.Item key="DeleteCategory" destructive>
          <ContextMenu.ItemTitle>Delete Category</ContextMenu.ItemTitle>
          <ContextMenu.ItemIcon
            ios={{
              name: "trash",
            }}
          />
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  )
}
