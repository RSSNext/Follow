import { Button } from "@follow/components/ui/button/index.js"
import type { FeedViewType } from "@follow/constants"
import { IN_ELECTRON } from "@follow/shared/constants"
import { env } from "@follow/shared/env"
import { UrlBuilder } from "@follow/utils/url-builder"
import { isBizId } from "@follow/utils/utils"
import { useMutation } from "@tanstack/react-query"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"

import type { FollowMenuItem, MenuItemInput } from "~/atoms/context-menu"
import { whoami } from "~/atoms/user"
import { useModalStack } from "~/components/ui/modal/stacked/hooks"
import { apiClient } from "~/lib/api-fetch"
import { useBoostModal } from "~/modules/boost/hooks"
import { useFeedClaimModal } from "~/modules/claim"
import { FeedForm } from "~/modules/discover/feed-form"
import { InboxForm } from "~/modules/discover/inbox-form"
import { ListForm } from "~/modules/discover/list-form"
import {
  CategoryCreationModalContent,
  ListCreationModalContent,
} from "~/modules/settings/tabs/lists/modals"
import { useResetFeed } from "~/queries/feed"
import { getFeedById, useFeedById } from "~/store/feed"
import { useInboxById } from "~/store/inbox"
import { listActions, useListById, useOwnedListByView } from "~/store/list"
import {
  subscriptionActions,
  useCategoriesByView,
  useSubscriptionByFeedId,
  useSubscriptionsByFeedIds,
} from "~/store/subscription"

import { useNavigateEntry } from "./useNavigateEntry"
import { getRouteParams } from "./useRouteParams"
import { useBatchUpdateSubscription, useDeleteSubscription } from "./useSubscriptionActions"

const ConfirmDestroyModalContent = ({ onConfirm }: { onConfirm: () => void }) => {
  const { t } = useTranslation()

  return (
    <div className="w-[540px]">
      <div className="mb-4">
        <i className="i-mingcute-warning-fill -mb-1 mr-1 size-5 text-red-500" />
        {t("sidebar.feed_actions.unfollow_feed_many_warning")}
      </div>
      <div className="flex justify-end">
        <Button className="bg-red-600" onClick={onConfirm}>
          {t("words.confirm")}
        </Button>
      </div>
    </div>
  )
}

export const useFeedActions = ({
  feedId,
  feedIds,
  view,
  type,
}: {
  feedId: string
  feedIds?: string[]
  view?: number
  type?: "feedList" | "entryList"
}) => {
  const { t } = useTranslation()
  const feed = useFeedById(feedId, (feed) => {
    return {
      type: feed.type,
      ownerUserId: feed.ownerUserId,
      id: feed.id,
      url: feed.url,
      siteUrl: feed.siteUrl,
    }
  })

  const inbox = useInboxById(feedId)
  const isInbox = !!inbox
  const subscription = useSubscriptionByFeedId(feedId)!

  const subscriptions = useSubscriptionsByFeedIds(
    useMemo(() => feedIds || [feedId], [feedId, feedIds]),
  )
  const { present } = useModalStack()
  const deleteSubscription = useDeleteSubscription({})
  const claimFeed = useFeedClaimModal()

  const navigateEntry = useNavigateEntry()
  const isEntryList = type === "entryList"

  const { mutateAsync: addFeedToListMutation } = useAddFeedToFeedList()
  const { mutateAsync: removeFeedFromListMutation } = useRemoveFeedFromFeedList()
  const { mutateAsync: resetFeed } = useResetFeed()
  const { mutate: addFeedsToCategoryMutation } = useBatchUpdateSubscription()
  const openBoostModal = useBoostModal()

  const listByView = useOwnedListByView(view!)
  const categories = useCategoriesByView(view!)

  const isMultipleSelection = feedIds && feedIds.length > 1 && feedIds.includes(feedId)

  const items = useMemo(() => {
    const related = feed || inbox
    if (!related) return []

    const isFeedOwner = related.ownerUserId === whoami()?.id

    const items: MenuItemInput[] = [
      {
        type: "text" as const,
        label: t("sidebar.feed_actions.mark_all_as_read"),
        shortcut: "Meta+Shift+A",
        disabled: isEntryList,
        click: () =>
          subscriptionActions.markReadByFeedIds({
            feedIds: isMultipleSelection ? feedIds : [feedId],
          }),
        supportMultipleSelection: true,
      },
      !related.ownerUserId &&
        !!isBizId(related.id) &&
        related.type === "feed" && {
          type: "text" as const,
          label: isEntryList
            ? t("sidebar.feed_actions.claim_feed")
            : t("sidebar.feed_actions.claim"),
          shortcut: "C",
          click: () => {
            claimFeed({ feedId })
          },
        },
      ...(isFeedOwner
        ? [
            {
              type: "text" as const,
              label: t("sidebar.feed_actions.feed_owned_by_you"),
            },
            {
              type: "text" as const,
              label: t("sidebar.feed_actions.reset_feed"),
              click: () => {
                resetFeed(feedId)
              },
            },
          ]
        : []),
      {
        type: "text" as const,
        label: t("words.boost"),
        click: () => {
          openBoostModal(feedId)
        },
      },
      {
        type: "separator" as const,
        disabled: isEntryList,
      },
      {
        type: "text" as const,
        label: t("sidebar.feed_column.context_menu.add_feeds_to_list"),
        disabled: isInbox,
        supportMultipleSelection: true,
        submenu: [
          ...listByView.map((list) => {
            const isIncluded = list.feedIds.includes(feedId)
            return {
              label: list.title || "",
              type: "text" as const,
              checked: isIncluded,
              click() {
                if (isMultipleSelection) {
                  addFeedToListMutation({
                    feedIds,
                    listId: list.id,
                  })
                  return
                }

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
          listByView.length > 0 && { type: "separator" as const },
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
        type: "text" as const,
        label: t("sidebar.feed_column.context_menu.add_feeds_to_category"),
        disabled: isInbox,
        supportMultipleSelection: true,
        submenu: [
          ...Array.from(categories.values()).map((category) => {
            const isIncluded = isMultipleSelection
              ? subscriptions.every((s) => s!.category === category)
              : subscription?.category === category
            return {
              label: category,
              type: "text" as const,
              checked: isIncluded,
              click() {
                addFeedsToCategoryMutation({
                  feedIdList: isMultipleSelection ? feedIds : [feedId],
                  category: isIncluded ? null : category, // if already included, remove it
                  view: view!,
                })
              },
            }
          }),
          listByView.length > 0 && { type: "separator" as const },
          {
            label: t("sidebar.feed_column.context_menu.create_category"),
            type: "text" as const,
            icon: <i className="i-mgc-add-cute-re" />,
            click() {
              present({
                title: t("sidebar.feed_column.context_menu.title"),
                content: () => (
                  <CategoryCreationModalContent
                    onSubmit={(category: string) => {
                      addFeedsToCategoryMutation({
                        feedIdList: isMultipleSelection ? feedIds : [feedId],
                        category,
                        view: view!,
                      })
                    }}
                  />
                ),
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
        disabled: isInbox,
        click: () => {
          present({
            title: t("sidebar.feed_actions.edit_feed"),
            content: ({ dismiss }) => <FeedForm asWidget id={feedId} onSuccess={dismiss} />,
          })
        },
      },
      {
        type: "text" as const,
        label: isMultipleSelection
          ? t("sidebar.feed_actions.unfollow_feed_many")
          : isEntryList
            ? t("sidebar.feed_actions.unfollow_feed")
            : t("sidebar.feed_actions.unfollow"),
        shortcut: "Meta+Backspace",
        disabled: isInbox,
        supportMultipleSelection: true,
        click: () => {
          if (isMultipleSelection) {
            present({
              title: t("sidebar.feed_actions.unfollow_feed_many_confirm"),
              content: ({ dismiss }) => (
                <ConfirmDestroyModalContent
                  onConfirm={() => {
                    deleteSubscription.mutate({ feedIdList: feedIds })
                    dismiss()
                  }}
                />
              ),
            })
            return
          }
          deleteSubscription.mutate({ subscription })
        },
      },
      {
        type: "text" as const,
        label: t("sidebar.feed_actions.navigate_to_feed"),
        shortcut: "Meta+G",
        disabled: isInbox || !isEntryList || getRouteParams().feedId === feedId,
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
        click: () => window.open(UrlBuilder.shareFeed(feedId, view), "_blank"),
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
          const { url, siteUrl } = feed || {}
          const copied = url || siteUrl
          if (!copied) return
          navigator.clipboard.writeText(copied)
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

    return items.filter(
      (item) =>
        !isMultipleSelection ||
        (typeof item === "object" &&
          item !== null &&
          "supportMultipleSelection" in item &&
          item.supportMultipleSelection),
    )
  }, [
    feed,
    inbox,
    t,
    isEntryList,
    isInbox,
    listByView,
    isMultipleSelection,
    feedId,
    feedIds,
    claimFeed,
    resetFeed,
    openBoostModal,
    addFeedToListMutation,
    removeFeedFromListMutation,
    present,
    deleteSubscription,
    subscription,
    navigateEntry,
    view,
  ])

  return items
}

export const useListActions = ({ listId, view }: { listId: string; view: FeedViewType }) => {
  const { t } = useTranslation()
  const list = useListById(listId)
  const subscription = useSubscriptionByFeedId(listId)!

  const { present } = useModalStack()
  const { mutateAsync: deleteSubscription } = useDeleteSubscription({})

  const navigateEntry = useNavigateEntry()

  const items = useMemo(() => {
    if (!list) return []

    const items: MenuItemInput[] = [
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
        click: () => deleteSubscription({ subscription }),
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
        click: () => window.open(UrlBuilder.shareList(listId, view), "_blank"),
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
          navigator.clipboard.writeText(UrlBuilder.shareList(listId, view))
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

  return items
}

export const useInboxActions = ({ inboxId }: { inboxId: string }) => {
  const { t } = useTranslation()
  const inbox = useInboxById(inboxId)
  const { present } = useModalStack()

  const items = useMemo(() => {
    if (!inbox) return []

    const items: FollowMenuItem[] = [
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

export const useAddFeedToFeedList = (options?: {
  onSuccess?: () => void
  onError?: () => void
}) => {
  const { t } = useTranslation("settings")
  return useMutation({
    mutationFn: async (
      payload: { feedId: string; listId: string } | { feedIds: string[]; listId: string },
    ) => {
      const feeds = await apiClient.lists.feeds.$post({
        json: payload,
      })

      feeds.data.forEach((feed) => listActions.addFeedToFeedList(payload.listId, feed))
    },
    onSuccess: () => {
      toast.success(t("lists.feeds.add.success"))

      options?.onSuccess?.()
    },
    async onError() {
      toast.error(t("lists.feeds.add.error"))
      options?.onError?.()
    },
  })
}

export const useRemoveFeedFromFeedList = (options?: {
  onSuccess: () => void
  onError: () => void
}) => {
  const { t } = useTranslation("settings")
  return useMutation({
    mutationFn: async (payload: { feedId: string; listId: string }) => {
      listActions.removeFeedFromFeedList(payload.listId, payload.feedId)
      await apiClient.lists.feeds.$delete({
        json: {
          listId: payload.listId,
          feedId: payload.feedId,
        },
      })
    },
    onSuccess: () => {
      toast.success(t("lists.feeds.delete.success"))
      options?.onSuccess?.()
    },
    async onError() {
      toast.error(t("lists.feeds.delete.error"))
      options?.onError?.()
    },
  })
}
