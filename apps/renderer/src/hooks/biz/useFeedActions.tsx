import { WEB_URL } from "@follow/shared/constants"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"

import { whoami } from "~/atoms/user"
import { useModalStack } from "~/components/ui/modal"
import type { NativeMenuItem } from "~/lib/native-menu"
import { useFeedClaimModal } from "~/modules/claim"
import { FeedForm } from "~/modules/discover/feed-form"
import { getFeedById, useFeedById } from "~/store/feed"
import { subscriptionActions, useSubscriptionByFeedId } from "~/store/subscription"

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
  const { t } = useTranslation()
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
        label: isEntryList ? t("sidebar.feed_actions.edit_feed") : t("sidebar.feed_actions.edit"),
        shortcut: "E",
        click: () => {
          present({
            title: t("sidebar.feed_actions.edit_feed"),
            content: ({ dismiss }) => <FeedForm asWidget id={feedId} onSuccess={dismiss} />,
          })
        },
      },
      {
        type: "text" as const,
        label: isEntryList
          ? t("sidebar.feed_actions.unfollow_feed")
          : t("sidebar.feed_actions.unfollow"),
        shortcut: "Meta+Backspace",
        click: () => deleteSubscription.mutate(subscription),
      },
      {
        type: "text" as const,
        label: t("sidebar.feed_actions.navigate_to_feed"),
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
        label: t("sidebar.feed_actions.mark_all_as_read"),
        shortcut: "Meta+Shift+A",
        disabled: isEntryList,
        click: () => subscriptionActions.markReadByFeedIds([feedId]),
      },
      ...(!feed.ownerUserId && !!feed.id
        ? [
            {
              type: "text" as const,
              label: isEntryList
                ? t("sidebar.feed_actions.claim_feed")
                : t("sidebar.feed_actions.claim"),
              shortcut: "C",
              click: () => {
                claimFeed()
              },
            },
          ]
        : []),
      ...(feed.ownerUserId === whoami()?.id
        ? [
            {
              type: "text" as const,
              label: t("sidebar.feed_actions.feed_owned_by_you"),
            },
          ]
        : []),
      {
        type: "separator" as const,
        disabled: isEntryList,
      },
      {
        type: "text" as const,
        label: t("sidebar.feed_actions.open_feed_in_browser"),
        disabled: isEntryList,
        shortcut: "O",
        click: () => window.open(`${WEB_URL}/feed/${feedId}?view=${view}`, "_blank"),
      },
      {
        type: "text" as const,
        label: t("sidebar.feed_actions.open_site_in_browser"),
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
        label: t("sidebar.feed_actions.copy_feed_url"),
        disabled: isEntryList,
        shortcut: "Meta+C",
        click: () => navigator.clipboard.writeText(feed.url),
      },
      {
        type: "text" as const,
        label: t("sidebar.feed_actions.copy_feed_id"),
        shortcut: "Meta+Shift+C",
        disabled: isEntryList,
        click: () => {
          navigator.clipboard.writeText(feedId)
        },
      },
    ]

    return items
  }, [
    t,
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
