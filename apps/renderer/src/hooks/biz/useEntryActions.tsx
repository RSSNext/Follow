import { FeedViewType } from "@follow/constants"
import type { CombinedEntryModel } from "@follow/models/types"
import { IN_ELECTRON } from "@follow/shared/constants"
import { nextFrame } from "@follow/utils/dom"
import { getOS } from "@follow/utils/utils"
import { useMutation } from "@tanstack/react-query"
import type { ReactNode } from "react"
import { useCallback, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"

import {
  getReadabilityStatus,
  ReadabilityStatus,
  setReadabilityContent,
  setReadabilityStatus,
} from "~/atoms/readability"
import {
  setShowSourceContent,
  toggleShowSourceContent,
  useShowSourceContent,
  useSourceContentModal,
} from "~/atoms/source-content"
import { whoami } from "~/atoms/user"
import { mountLottie } from "~/components/ui/lottie-container"
import { shortcuts } from "~/constants/shortcuts"
import { tipcClient } from "~/lib/client"
import StarAnimationUri from "~/lottie/star.lottie?url"
import { useTipModal } from "~/modules/wallet/hooks"
import type { FlatEntryModel } from "~/store/entry"
import { entryActions } from "~/store/entry"
import { getFeedById, useFeedById } from "~/store/feed"
import { useInboxById } from "~/store/inbox"

import { useIntegrationActions } from "./useIntegrationActions"
import { navigateEntry } from "./useNavigateEntry"

const absoluteStarAnimationUri = new URL(StarAnimationUri, import.meta.url).href

export const useEntryReadabilityToggle = ({ id, url }: { id: string; url: string }) =>
  useCallback(async () => {
    const status = getReadabilityStatus()[id]
    const isTurnOn = status !== ReadabilityStatus.INITIAL && !!status

    if (!isTurnOn && url) {
      setReadabilityStatus({
        [id]: ReadabilityStatus.WAITING,
      })
      const result = await tipcClient
        ?.readability({
          url,
        })
        .catch(() => {
          setReadabilityStatus({
            [id]: ReadabilityStatus.FAILURE,
          })
        })

      if (result) {
        const status = getReadabilityStatus()[id]
        if (status !== ReadabilityStatus.WAITING) return
        setReadabilityStatus({
          [id]: ReadabilityStatus.SUCCESS,
        })
        setReadabilityContent({
          [id]: result,
        })
      }
    } else {
      setReadabilityStatus({
        [id]: ReadabilityStatus.INITIAL,
      })
    }
  }, [id, url])
export const useCollect = (entry: Nullable<CombinedEntryModel>) => {
  const { t } = useTranslation()
  return useMutation({
    mutationFn: async () => entry && entryActions.markStar(entry.entries.id, true),

    onSuccess: () => {
      toast.success(t("entry_actions.starred"), {
        duration: 1000,
      })
    },
  })
}

export const useUnCollect = (entry: Nullable<CombinedEntryModel>) => {
  const { t } = useTranslation()
  return useMutation({
    mutationFn: async () => entry && entryActions.markStar(entry.entries.id, false),

    onSuccess: () => {
      toast.success(t("entry_actions.unstarred"), {
        duration: 1000,
      })
    },
  })
}

export const useRead = () =>
  useMutation({
    mutationFn: async (entry: Nullable<CombinedEntryModel>) => {
      const relatedId = entry?.feeds?.id || entry?.inboxes?.id
      if (!relatedId) return
      return entryActions.markRead({
        feedId: relatedId,
        entryId: entry.entries.id,
        read: true,
      })
    },
  })
export const useUnread = () =>
  useMutation({
    mutationFn: async (entry: Nullable<CombinedEntryModel>) => {
      const relatedId = entry?.feeds?.id || entry?.inboxes?.id
      if (!relatedId) return
      return entryActions.markRead({
        feedId: relatedId,
        entryId: entry.entries.id,
        read: false,
      })
    },
  })

export const useDeleteInboxEntry = () => {
  const { t } = useTranslation()
  return useMutation({
    mutationFn: async (entryId: string) => {
      await entryActions.deleteInboxEntry(entryId)
    },
    onSuccess: () => {
      toast.success(t("entry_actions.deleted"))
    },
    onError: () => {
      toast.error(t("entry_actions.failed_to_delete"))
    },
  })
}

export const useEntryActions = ({
  view,
  entry,
  type,
  inList,
}: {
  view?: number
  entry?: FlatEntryModel | null
  type?: "toolbar" | "entryList"
  inList?: boolean
}) => {
  const { t } = useTranslation()

  const feed = useFeedById(entry?.feedId, (feed) => {
    return {
      type: feed.type,
      ownerUserId: feed.ownerUserId,
      id: feed.id,
    }
  })
  const integrationActions = useIntegrationActions({ entry, view })
  const inbox = useInboxById(entry?.inboxId)
  const isInbox = !!inbox

  const populatedEntry = useMemo(() => {
    if (!entry) return null
    if (!feed?.id && !inbox?.id) return null

    return {
      ...entry,
      feeds: feed ? getFeedById(feed.id) : undefined,
      inboxes: inbox,
    } as CombinedEntryModel
  }, [entry, feed, inbox])

  const openTipModal = useTipModal()

  const showSourceContent = useShowSourceContent()
  const showSourceContentModal = useSourceContentModal()

  const collect = useCollect(populatedEntry)
  const uncollect = useUnCollect(populatedEntry)
  const read = useRead()
  const unread = useUnread()
  const deleteInboxEntry = useDeleteInboxEntry()

  const items = useMemo(() => {
    if (!populatedEntry || view === undefined) return []

    const items: {
      key: string
      className?: string
      shortcut?: string
      name: string
      icon?: ReactNode
      hide?: boolean
      active?: boolean
      disabled?: boolean
      onClick: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
    }[] = [
      ...integrationActions.items,
      {
        key: "tip",
        shortcut: shortcuts.entry.tip.key,
        name: t("entry_actions.tip"),
        className: "i-mgc-power-outline",
        hide: isInbox || feed?.ownerUserId === whoami()?.id,
        onClick: () => {
          nextFrame(() =>
            openTipModal({
              userId: populatedEntry?.feeds?.ownerUserId ?? undefined,
              feedId: populatedEntry?.feeds?.id ?? undefined,
              entryId: populatedEntry?.entries.id ?? undefined,
            }),
          )
        },
      },
      {
        key: "star",
        shortcut: shortcuts.entry.toggleStarred.key,
        name: t("entry_actions.star"),
        className: "i-mgc-star-cute-re",
        hide: !!populatedEntry.collections,
        onClick: (e) => {
          if (type === "toolbar") {
            mountLottie(absoluteStarAnimationUri, {
              x: e.clientX - 90,
              y: e.clientY - 70,
              height: 126,
              width: 252,
            })
          }

          collect.mutate()
        },
      },
      {
        key: "unstar",
        name: t("entry_actions.unstar"),
        shortcut: shortcuts.entry.toggleStarred.key,
        className: "i-mgc-star-cute-fi text-orange-500",
        hide: !populatedEntry.collections,
        onClick: () => {
          uncollect.mutate()
        },
      },
      {
        key: "delete",
        name: t("entry_actions.delete"),
        hide: !isInbox,
        className: "i-mgc-delete-2-cute-re",
        onClick: () => {
          deleteInboxEntry.mutate(populatedEntry.entries.id)
        },
      },
      {
        key: "copyLink",
        name: t("entry_actions.copy_link"),
        className: "i-mgc-link-cute-re",
        hide: !populatedEntry.entries.url,
        shortcut: shortcuts.entry.copyLink.key,
        onClick: () => {
          if (!populatedEntry.entries.url) return
          navigator.clipboard.writeText(populatedEntry.entries.url)
          toast(t("entry_actions.copied_notify", { which: t("words.link") }), {
            duration: 1000,
          })
        },
      },
      {
        key: "copyTitle",
        name: t("entry_actions.copy_title"),
        className: tw`i-mgc-copy-cute-re`,
        hide: !populatedEntry.entries.title || type === "toolbar",
        shortcut: shortcuts.entry.copyTitle.key,
        onClick: () => {
          if (!populatedEntry.entries.title) return
          navigator.clipboard.writeText(populatedEntry.entries.title)
          toast(t("entry_actions.copied_notify", { which: t("words.title") }), {
            duration: 1000,
          })
        },
      },
      {
        key: "openInBrowser",
        name: t("entry_actions.open_in_browser", {
          which: t(IN_ELECTRON ? "words.browser" : "words.newTab"),
        }),
        shortcut: shortcuts.entry.openInBrowser.key,
        className: "i-mgc-world-2-cute-re",
        hide: type === "toolbar" || !populatedEntry.entries.url,
        onClick: () => {
          if (!populatedEntry.entries.url) return
          window.open(populatedEntry.entries.url, "_blank")
        },
      },
      {
        key: "viewSourceContent",
        name: t("entry_actions.view_source_content"),
        // shortcut: shortcuts.entry.openInBrowser.key,
        className: !showSourceContent ? "i-mgc-world-2-cute-re" : tw`i-mgc-world-2-cute-fi`,
        hide: !populatedEntry.entries.url,
        active: showSourceContent,
        onClick: () => {
          if (!populatedEntry.entries.url) return
          const viewPreviewInModal = [
            FeedViewType.SocialMedia,
            FeedViewType.Videos,
            FeedViewType.Pictures,
          ].includes(view!)
          if (viewPreviewInModal) {
            showSourceContentModal({
              title: populatedEntry.entries.title ?? undefined,
              src: populatedEntry.entries.url,
            })
            return
          }
          if (type === "toolbar") {
            toggleShowSourceContent()
            return
          }
          navigateEntry({ entryId: populatedEntry.entries.id })
          setShowSourceContent(true)
        },
      },
      {
        name: t("entry_actions.share"),
        key: "share",
        className: getOS() === "macOS" ? `i-mgc-share-3-cute-re` : "i-mgc-share-forward-cute-re",
        shortcut: shortcuts.entry.share.key,
        hide: !(populatedEntry.entries.url && navigator.share),

        onClick: () => {
          if (!populatedEntry.entries.url) return

          if (IN_ELECTRON) {
            return tipcClient?.showShareMenu(populatedEntry.entries.url)
          } else {
            navigator.share({
              url: populatedEntry.entries.url,
            })
          }
          return
        },
      },
      {
        key: "read",
        name: t("entry_actions.mark_as_read"),
        shortcut: shortcuts.entry.toggleRead.key,
        className: "i-mgc-round-cute-fi",
        hide: !!(!!populatedEntry.read || populatedEntry.collections) || inList,
        onClick: () => {
          read.mutate(populatedEntry)
        },
      },
      {
        key: "unread",
        name: t("entry_actions.mark_as_unread"),
        shortcut: shortcuts.entry.toggleRead.key,
        className: "i-mgc-round-cute-re",
        hide: !!(!populatedEntry.read || populatedEntry.collections) || inList,
        onClick: () => {
          unread.mutate(populatedEntry)
        },
      },
    ]

    return items
  }, [
    populatedEntry,
    view,
    integrationActions.items,
    t,
    isInbox,
    feed?.ownerUserId,
    type,
    showSourceContent,
    inList,
    openTipModal,
    collect,
    uncollect,
    deleteInboxEntry,
    showSourceContentModal,
    read,
    unread,
  ])

  return {
    items,
  }
}
