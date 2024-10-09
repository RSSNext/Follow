import { IN_ELECTRON, WEB_URL } from "@follow/shared/constants"
import { env } from "@follow/shared/env"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"

import { whoami } from "~/atoms/user"
import { useModalStack } from "~/components/ui/modal"
import type { FeedViewType } from "~/lib/enum"
import type { NativeMenuItem, NullableNativeMenuItem } from "~/lib/native-menu"
import { useFeedClaimModal } from "~/modules/claim"
import { FeedForm } from "~/modules/discover/feed-form"
import { InboxForm } from "~/modules/discover/inbox-form"
import { ListForm } from "~/modules/discover/list-form"
import { ListCreationModalContent } from "~/modules/settings/tabs/lists/modals"
import {
  getFeedById,
  useAddFeedToFeedList,
  useFeedById,
  useRemoveFeedFromFeedList,
} from "~/store/feed"
import { useInboxById } from "~/store/inbox"
import { useListById, useListByView } from "~/store/list"
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

  const { mutateAsync: addFeedToListMutation } = useAddFeedToFeedList()
  const { mutateAsync: removeFeedFromListMutation } = useRemoveFeedFromFeedList()

  const listByView = useListByView(view!)

  const items = useMemo(() => {
    if (!feed) return []

    const items: NativeMenuItem[] = [
      {
        type: "text" as const,
        label: t("sidebar.feed_actions.mark_all_as_read"),
        shortcut: "Meta+Shift+A",
        disabled: isEntryList,
        click: () => subscriptionActions.markReadByFeedIds({ feedIds: [feedId] }),
      },
      ...(!feed.ownerUserId && !!feed.id && !false
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
        label: t("sidebar.feed_column.context_menu.add_feeds_to_list"),
        submenu: [
          ...listByView.map((list) => {
            const isIncluded = list.feedIds.includes(feedId)
            return {
              label: list.title || "",
              type: "text" as const,
              checked: isIncluded,
              click() {
                if (!isIncluded) {
                  addFeedToListMutation({
                    feedId,
                    listId: list.id,
                  })
                } else {
                  removeFeedFromListMutation({
                    feedId,
                    listId: list.id,
                  })
                }
              },
            }
          }),
          {
            type: "separator",
          },
          {
            label: t("sidebar.feed_actions.create_list"),
            type: "text" as const,
            icon: <i className="i-mgc-add-cute-re" />,
            click() {
              present({
                title: t("sidebar.feed_actions.create_list"),
                content: () => <ListCreationModalContent />,
              })
            },
          },
        ],
      },
      {
        type: "separator" as const,
        disabled: isEntryList,
      },
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
        type: "text" as const,
        label: t("sidebar.feed_actions.open_feed_in_browser", {
          which: t(IN_ELECTRON ? "words.browser" : "words.newTab"),
        }),
        disabled: isEntryList,
        shortcut: "O",
        click: () => window.open(`${WEB_URL}/feed/${feedId}?view=${view}`, "_blank"),
      },
      {
        type: "text" as const,
        label: t("sidebar.feed_actions.open_site_in_browser", {
          which: t(IN_ELECTRON ? "words.browser" : "words.newTab"),
        }),
        shortcut: "Meta+O",
        disabled: isEntryList,
        click: () => {
          const feed = getFeedById(feedId)
          if (feed) {
            "siteUrl" in feed && feed.siteUrl && window.open(feed.siteUrl, "_blank")
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
        click: () => {
          // @ts-expect-error
          const { url } = feed || {}
          if (!url) return
          navigator.clipboard.writeText(url)
        },
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
    feed,
    t,
    isEntryList,
    listByView,
    feedId,
    claimFeed,
    addFeedToListMutation,
    removeFeedFromListMutation,
    present,
    deleteSubscription,
    subscription,
    navigateEntry,
    view,
  ])

  return { items }
}

export const useListActions = ({ listId, view }: { listId: string; view: FeedViewType }) => {
  const { t } = useTranslation()
  const list = useListById(listId)
  const subscription = useSubscriptionByFeedId(listId)

  const { present } = useModalStack()
  const { mutateAsync: deleteSubscription } = useDeleteSubscription({})

  const navigateEntry = useNavigateEntry()

  const items = useMemo(() => {
    if (!list) return []

    const items: NullableNativeMenuItem[] = [
      list.ownerUserId === whoami()?.id && {
        type: "text" as const,
        label: t("sidebar.feed_actions.list_owned_by_you"),
      },
      {
        type: "separator" as const,
        hide: list.ownerUserId !== whoami()?.id,
      },

      {
        type: "text" as const,
        label: t("sidebar.feed_actions.edit"),
        shortcut: "E",
        click: () => {
          present({
            title: t("sidebar.feed_actions.edit_list"),
            content: ({ dismiss }) => <ListForm asWidget id={listId} onSuccess={dismiss} />,
          })
        },
      },
      {
        type: "text" as const,
        label: t("sidebar.feed_actions.unfollow"),
        shortcut: "Meta+Backspace",
        click: () => deleteSubscription(subscription),
      },
      {
        type: "text" as const,
        label: t("sidebar.feed_actions.navigate_to_list"),
        shortcut: "Meta+G",
        disabled: getRouteParams().feedId === listId,
        click: () => {
          navigateEntry({ listId })
        },
      },
      {
        type: "separator" as const,
        disabled: false,
      },
      {
        type: "text" as const,
        label: t("sidebar.feed_actions.open_list_in_browser", {
          which: t(IN_ELECTRON ? "words.browser" : "words.newTab"),
        }),
        disabled: false,
        shortcut: "O",
        click: () => window.open(`${WEB_URL}/list/${listId}?view=${view}`, "_blank"),
      },

      {
        type: "separator",
        disabled: false,
      },
      {
        type: "text" as const,
        label: t("sidebar.feed_actions.copy_list_url"),
        disabled: false,
        shortcut: "Meta+C",
        click: () => {
          const url = `${WEB_URL}/list/${listId}?view=${view}`
          navigator.clipboard.writeText(url)
        },
      },
      {
        type: "text" as const,
        label: t("sidebar.feed_actions.copy_list_id"),
        shortcut: "Meta+Shift+C",
        disabled: false,
        click: () => {
          navigator.clipboard.writeText(listId)
        },
      },
    ]

    return items
  }, [list, t, present, deleteSubscription, subscription, navigateEntry, listId, view])

  return { items }
}

export const useInboxActions = ({ inboxId }: { inboxId: string }) => {
  const { t } = useTranslation()
  const inbox = useInboxById(inboxId)
  const { present } = useModalStack()

  const items = useMemo(() => {
    if (!inbox) return []

    const items: NativeMenuItem[] = [
      {
        type: "text" as const,
        label: t("sidebar.feed_actions.edit"),
        shortcut: "E",
        click: () => {
          present({
            title: t("sidebar.feed_actions.edit_inbox"),
            content: ({ dismiss }) => <InboxForm asWidget id={inboxId} onSuccess={dismiss} />,
          })
        },
      },
      {
        type: "separator" as const,
        disabled: false,
      },
      {
        type: "text" as const,
        label: t("sidebar.feed_actions.copy_email_address"),
        shortcut: "Meta+Shift+C",
        disabled: false,
        click: () => {
          navigator.clipboard.writeText(`${inboxId}${env.VITE_INBOXES_EMAIL}`)
        },
      },
    ]

    return items
  }, [inbox, t, inboxId, present])

  return { items }
}
