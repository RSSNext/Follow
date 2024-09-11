import { whoami } from "@renderer/atoms/user"
import { useModalStack } from "@renderer/components/ui/modal"
import type { NativeMenuItem } from "@renderer/lib/native-menu"
import { useFeedClaimModal } from "@renderer/modules/claim"
import { FeedForm } from "@renderer/modules/discover/feed-form"
import { getFeedById, useFeedById } from "@renderer/store/feed"
import { subscriptionActions, useSubscriptionByFeedId } from "@renderer/store/subscription"
import { WEB_URL } from "@shared/constants"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"

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
        label: isEntryList
          ? t("sidebar.feed_item.context_menu.edit_feed")
          : t("sidebar.feed_item.context_menu.edit"),
        shortcut: "E",
        click: () => {
          present({
            title: t("sidebar.feed_item.context_menu.edit_feed"),
            content: ({ dismiss }) => <FeedForm asWidget id={feedId} onSuccess={dismiss} />,
          })
        },
      },
      {
        type: "text" as const,
        label: isEntryList
          ? t("sidebar.feed_item.context_menu.unfollow_feed")
          : t("sidebar.feed_item.context_menu.unfollow"),
        shortcut: "Meta+Backspace",
        click: () => deleteSubscription.mutate(subscription),
      },
      {
        type: "text" as const,
        label: t("sidebar.feed_item.context_menu.navigate_to_feed"),
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
        label: t("sidebar.feed_item.context_menu.mark_all_as_read"),
        shortcut: "Meta+Shift+A",
        disabled: isEntryList,
        click: () => subscriptionActions.markReadByFeedIds([feedId]),
      },
      ...(!feed.ownerUserId && !!feed.id
        ? [
            {
              type: "text" as const,
              label: isEntryList
                ? t("sidebar.feed_item.context_menu.claim_feed")
                : t("sidebar.feed_item.context_menu.claim"),
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
              label: t("sidebar.feed_item.context_menu.owned_by_you"),
            },
          ]
        : []),
      {
        type: "separator" as const,
        disabled: isEntryList,
      },

      {
        type: "text" as const,
        label: t("sidebar.feed_item.context_menu.open_feed_in_browser"),
        disabled: isEntryList,
        shortcut: "O",
        click: () => window.open(`${WEB_URL}/feed/${feedId}?view=${view}`, "_blank"),
      },
      {
        type: "text" as const,
        label: t("sidebar.feed_item.context_menu.open_site_in_browser"),
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
        label: t("sidebar.feed_item.context_menu.copy_feed_url"),
        disabled: isEntryList,
        shortcut: "Meta+C",
        click: () => navigator.clipboard.writeText(feed.url),
      },
      {
        type: "text" as const,
        label: t("sidebar.feed_item.context_menu.copy_feed_id"),
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
