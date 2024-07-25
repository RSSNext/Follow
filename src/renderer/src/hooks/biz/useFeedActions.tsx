import { getMe } from "@renderer/atoms/user"
import { useModalStack } from "@renderer/components/ui/modal"
import { useFeedClaimModal } from "@renderer/modules/claim"
import { FeedForm } from "@renderer/modules/discover/feed-form"
import { getFeedById, useFeedById } from "@renderer/store/feed"
import { useSubscriptionByFeedId } from "@renderer/store/subscription"
import { WEB_URL } from "@shared/constants"
import { useMemo } from "react"

import { useDeleteSubscription } from "./useSubscriptionActions"

export const useFeedActions = ({
  feedId,
  view,
}: {
  feedId: string
  view?: number
}) => {
  const feed = useFeedById(feedId)
  const subscription = useSubscriptionByFeedId(feedId)

  const { present } = useModalStack()
  const deleteSubscription = useDeleteSubscription({})
  const claimFeed = useFeedClaimModal({
    feedId,
  })

  const items = useMemo(() => {
    if (!feed) return []
    const items = [
      {
        type: "text" as const,
        label: "Edit",

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
        label: "Unfollow",
        click: () => deleteSubscription.mutate(subscription),
      },
      {
        type: "separator" as const,
      },
      ...(!feed.ownerUserId && !!feed.id ?
          [{
            type: "text" as const,
            label: "Claim",
            click: () => {
              claimFeed()
            },
          }] :
          []),
      ...(feed.ownerUserId === getMe()?.id ?
          [
            {
              type: "text" as const,
              label: "This feed is owned by you",
            },
          ] :
          []),
      {
        type: "separator" as const,
      },
      {
        type: "text" as const,
        label: "Open Feed in Browser",
        click: () =>
          window.open(`${WEB_URL}/feed/${feedId}?view=${view}`, "_blank"),
      },
      {
        type: "text" as const,
        label: "Open Site in Browser",
        click: () => {
          const feed = getFeedById(feedId)
          if (feed) {
            feed.siteUrl && window.open(feed.siteUrl, "_blank")
          }
        },
      },
    ]

    return items
  }, [feedId])

  return { items }
}
