import { whoami } from "@renderer/atoms/user"
import { useModalStack } from "@renderer/components/ui/modal"
import type { NativeMenuItem } from "@renderer/lib/native-menu"
import { useFeedClaimModal } from "@renderer/modules/claim"
import { FeedForm } from "@renderer/modules/discover/feed-form"
import { getFeedById, useFeedById } from "@renderer/store/feed"
import {
  subscriptionActions,
  useSubscriptionByFeedId,
} from "@renderer/store/subscription"
import { WEB_URL } from "@shared/constants"
import { useMemo } from "react"

import { useNavigateEntry } from "./useNavigateEntry"
import { getRouteParams } from "./useRouteParams"
import { useDeleteSubscription } from "./useSubscriptionActions"

export const useFeedActions = ({
  feedId,
  view,
  type,
}: {
  feedId: string
  view?: number
  type?: "feedList" | "entryList"
}) => {
  const feed = useFeedById(feedId)
  const subscription = useSubscriptionByFeedId(feedId)

  const { present } = useModalStack()
  const deleteSubscription = useDeleteSubscription({})
  const claimFeed = useFeedClaimModal({
    feedId,
  })

  const navigateEntry = useNavigateEntry()
  const isEntryList = type === "entryList"

  const items = useMemo(() => {
    if (!feed) return []
    const items: NativeMenuItem[] = [
      {
        type: "text" as const,
        label: isEntryList ? "Edit Feed" : "Edit",
        shortcut: "E",
        click: () => {
          present({
            title: "Edit Feed",
            content: ({ dismiss }) => (
              <FeedForm asWidget id={feedId} onSuccess={dismiss} />
            ),
          })
        },
      },
      {
        type: "text" as const,
        label: isEntryList ? "Unfollow Feed" : "Unfollow",
        shortcut: "Meta+Backspace",
        click: () => deleteSubscription.mutate(subscription),
      },
      {
        type: "text" as const,
        label: "Navigate to Feed",
        shortcut: "Meta+G",
        disabled: !isEntryList || getRouteParams().feedId === feedId,
        click: () => {
          navigateEntry({ feedId })
        },
      },
      {
        type: "separator" as const,
        disabled: isEntryList,
      },
      {
        type: "text",
        label: "Mark All as Read",
        shortcut: "Meta+Shift+A",
        disabled: isEntryList,
        click: () => subscriptionActions.markReadByFeedIds([feedId]),
      },
      ...(!feed.ownerUserId && !!feed.id ?
          [
            {
              type: "text" as const,
              label: isEntryList ? "Claim Feed" : "Claim",
              shortcut: "C",
              click: () => {
                claimFeed()
              },
            },
          ] :
          []),
      ...(feed.ownerUserId === whoami()?.id ?
          [
            {
              type: "text" as const,
              label: "This feed is owned by you",
            },
          ] :
          []),
      {
        type: "separator" as const,
        disabled: isEntryList,
      },

      {
        type: "text" as const,
        label: "Open Feed in Browser",
        disabled: isEntryList,
        shortcut: "O",
        click: () =>
          window.open(`${WEB_URL}/feed/${feedId}?view=${view}`, "_blank"),
      },
      {
        type: "text" as const,
        label: "Open Site in Browser",
        shortcut: "Meta+O",
        disabled: isEntryList,
        click: () => {
          const feed = getFeedById(feedId)
          if (feed) {
            feed.siteUrl && window.open(feed.siteUrl, "_blank")
          }
        },
      },
      {
        type: "separator",
        disabled: isEntryList,
      },
      {
        type: "text" as const,
        label: "Copy Feed URL",
        disabled: isEntryList,
        shortcut: "Meta+C",
        click: () => navigator.clipboard.writeText(feed.url),
      },
      {
        type: "text" as const,
        label: "Copy Feed ID",
        shortcut: "Meta+Shift+C",
        disabled: isEntryList,
        click: () => {
          navigator.clipboard.writeText(feedId)
        },
      },
    ]

    return items
  }, [
    claimFeed,
    deleteSubscription,
    feed,
    feedId,
    isEntryList,
    navigateEntry,
    present,
    subscription,
    view,
  ])

  return { items }
}
