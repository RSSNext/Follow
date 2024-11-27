import { FeedViewType } from "@follow/constants"
import { IN_ELECTRON } from "@follow/shared/constants"
import { getOS } from "@follow/utils/utils"
import { useMutation } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"

import { toggleShowAISummary } from "~/atoms/ai-summary"
import { toggleShowAITranslation } from "~/atoms/ai-translation"
import { setShowSourceContent, useSourceContentModal } from "~/atoms/source-content"
import { navigateEntry } from "~/hooks/biz/useNavigateEntry"
import { getRouteParams } from "~/hooks/biz/useRouteParams"
import { tipcClient } from "~/lib/client"
import { useTipModal } from "~/modules/wallet/hooks"
import { entryActions, useEntryStore } from "~/store/entry"

import { useRegisterFollowCommand } from "../hooks/use-register-command"
import { COMMAND_ID } from "./id"

const useCollect = () => {
  const { t } = useTranslation()
  return useMutation({
    mutationFn: async ({ entryId, view }: { entryId: string; view?: FeedViewType }) =>
      entryActions.markStar(entryId, true, view),

    onSuccess: () => {
      toast.success(t("entry_actions.starred"), {
        duration: 1000,
      })
    },
  })
}

const useUnCollect = () => {
  const { t } = useTranslation()
  return useMutation({
    mutationFn: async (entryId: string) => entryActions.markStar(entryId, false),

    onSuccess: () => {
      toast.success(t("entry_actions.unstarred"), {
        duration: 1000,
      })
    },
  })
}

const useDeleteInboxEntry = () => {
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

export const useRead = () =>
  useMutation({
    mutationFn: async ({ feedId, entryId }: { feedId: string; entryId: string }) =>
      entryActions.markRead({
        feedId,
        entryId,
        read: true,
      }),
  })

export const useUnread = () =>
  useMutation({
    mutationFn: async ({ feedId, entryId }: { feedId: string; entryId: string }) =>
      entryActions.markRead({
        feedId,
        entryId,
        read: false,
      }),
  })

export const useRegisterEntryCommands = () => {
  const { t } = useTranslation()
  const collect = useCollect()
  const uncollect = useUnCollect()
  const deleteInboxEntry = useDeleteInboxEntry()
  const showSourceContentModal = useSourceContentModal()
  const openTipModal = useTipModal()
  const read = useRead()
  const unread = useUnread()

  useRegisterFollowCommand([
    {
      id: COMMAND_ID.entry.tip,
      label: t("entry_actions.tip"),
      icon: <i className="i-mgc-power-outline" />,
      // keyBinding: shortcuts.entry.tip.key,
      // when: !isInbox && feed?.ownerUserId !== whoami()?.id && !!populatedEntry,
      run: ({ userId, feedId, entryId }) => {
        openTipModal({
          userId,
          feedId,
          entryId,
        })
      },
    },
    {
      id: COMMAND_ID.entry.star,
      label: t("entry_actions.star"),
      icon: <i className="i-mgc-star-cute-re" />,
      run: ({ entryId, view }) => {
        const entry = useEntryStore.getState().flatMapEntries[entryId]
        if (!entry) {
          toast.error("Failed to star: entry is not available", { duration: 3000 })
          return
        }
        // if (type === "toolbar") {
        //   const absoluteStarAnimationUri = new URL(StarAnimationUri, import.meta.url).href
        //   mountLottie(absoluteStarAnimationUri, {
        //     x: e.clientX - 90,
        //     y: e.clientY - 70,
        //     height: 126,
        //     width: 252,
        //   })
        // }
        collect.mutate({ entryId, view })
      },
    },
    {
      id: COMMAND_ID.entry.unstar,
      label: t("entry_actions.unstar"),
      icon: <i className="i-mgc-star-cute-fi text-orange-500" />,
      run: ({ entryId }) => {
        const entry = useEntryStore.getState().flatMapEntries[entryId]
        if (!entry) {
          toast.error("Failed to unstar: entry is not available", { duration: 3000 })
          return
        }
        uncollect.mutate(entry.entries.id)
      },
    },
    {
      id: COMMAND_ID.entry.delete,
      label: t("entry_actions.delete"),
      icon: <i className="i-mgc-delete-2-cute-re" />,
      run: ({ entryId }) => {
        const entry = useEntryStore.getState().flatMapEntries[entryId]
        if (!entry) {
          toast.error("Failed to delete: entry is not available", { duration: 3000 })
          return
        }
        deleteInboxEntry.mutate(entry.entries.id)
      },
    },
    {
      id: COMMAND_ID.entry.copyLink,
      label: t("entry_actions.copy_link"),
      icon: <i className="i-mgc-link-cute-re" />,
      run: ({ entryId }) => {
        const entry = useEntryStore.getState().flatMapEntries[entryId]
        if (!entry) {
          toast.error("Failed to copy link: entry is not available", { duration: 3000 })
          return
        }
        if (!entry.entries.url) return
        navigator.clipboard.writeText(entry.entries.url)
        toast(t("entry_actions.copied_notify", { which: t("words.link") }), {
          duration: 1000,
        })
      },
    },
    {
      id: COMMAND_ID.entry.copyTitle,
      label: t("entry_actions.copy_title"),
      icon: <i className="i-mgc-copy-cute-re" />,
      run: ({ entryId }) => {
        const entry = useEntryStore.getState().flatMapEntries[entryId]
        if (!entry) {
          toast.error("Failed to copy link: entry is not available", { duration: 3000 })
          return
        }
        if (!entry.entries.title) return
        navigator.clipboard.writeText(entry.entries.title)
        toast(t("entry_actions.copied_notify", { which: t("words.title") }), {
          duration: 1000,
        })
      },
    },
    {
      id: COMMAND_ID.entry.openInBrowser,
      label: t("entry_actions.open_in_browser", {
        which: t(IN_ELECTRON ? "words.browser" : "words.newTab"),
      }),
      icon: <i className="i-mgc-world-2-cute-re" />,
      run: ({ entryId }) => {
        const entry = useEntryStore.getState().flatMapEntries[entryId]
        if (!entry || !entry.entries.url) {
          toast.error("Failed to open in browser: url is not available", { duration: 3000 })
          return
        }
        window.open(entry.entries.url, "_blank")
      },
    },
    {
      id: COMMAND_ID.entry.viewSourceContent,
      label: t("entry_actions.view_source_content"),
      icon: <i className="i-mgc-world-2-cute-re" />,
      run: ({ entryId }) => {
        const entry = useEntryStore.getState().flatMapEntries[entryId]
        if (!entry || !entry.entries.url) {
          toast.error("Failed to view source content: url is not available", { duration: 3000 })
          return
        }
        const routeParams = getRouteParams()
        const viewPreviewInModal = [
          FeedViewType.SocialMedia,
          FeedViewType.Videos,
          FeedViewType.Pictures,
        ].includes(routeParams.view)
        if (viewPreviewInModal) {
          showSourceContentModal({
            title: entry.entries.title ?? undefined,
            src: entry.entries.url,
          })
          return
        }
        const layoutEntryId = routeParams.entryId
        if (layoutEntryId !== entry.entries.id) {
          navigateEntry({ entryId: entry.entries.id })
        }
        setShowSourceContent(true)
      },
    },
    {
      id: COMMAND_ID.entry.viewEntryContent,
      label: t("entry_actions.view_source_content"),
      icon: <i className="i-mgc-world-2-cute-fi" />,
      run: () => {
        setShowSourceContent(false)
      },
    },
    {
      id: COMMAND_ID.entry.share,
      label: t("entry_actions.share"),
      icon:
        getOS() === "macOS" ? (
          <i className="i-mgc-share-3-cute-re" />
        ) : (
          <i className="i-mgc-share-forward-cute-re" />
        ),
      run: ({ entryId }) => {
        const entry = useEntryStore.getState().flatMapEntries[entryId]
        if (!entry || !entry.entries.url) {
          toast.error("Failed to share: url is not available", { duration: 3000 })
          return
        }
        if (!entry.entries.url) return

        if (IN_ELECTRON) {
          return tipcClient?.showShareMenu(entry.entries.url)
        } else {
          navigator.share({
            url: entry.entries.url,
          })
        }
        return
      },
    },
    {
      id: COMMAND_ID.entry.read,
      label: t("entry_actions.mark_as_read"),
      icon: <i className="i-mgc-round-cute-fi" />,
      run: ({ entryId }) => {
        const entry = useEntryStore.getState().flatMapEntries[entryId]
        if (!entry) {
          toast.error("Failed to mark as unread: feed is not available", { duration: 3000 })
          return
        }
        read.mutate({ entryId, feedId: entry.feedId })
      },
    },
    {
      id: COMMAND_ID.entry.unread,
      label: t("entry_actions.mark_as_unread"),
      icon: <i className="i-mgc-round-cute-re" />,
      run: ({ entryId }) => {
        const entry = useEntryStore.getState().flatMapEntries[entryId]
        if (!entry) {
          toast.error("Failed to mark as unread: feed is not available", { duration: 3000 })
          return
        }
        unread.mutate({ entryId, feedId: entry.feedId })
      },
    },
    {
      id: COMMAND_ID.entry.toggleAISummary,
      label: t("entry_actions.toggle_ai_summary"),
      icon: <i className="i-mgc-magic-2-cute-re" />,
      run: () => {
        toggleShowAISummary()
      },
    },
    {
      id: COMMAND_ID.entry.toggleAITranslation,
      label: t("entry_actions.toggle_ai_translation"),
      icon: <i className="i-mgc-translate-2-cute-re" />,
      run: () => {
        toggleShowAITranslation()
      },
    },
  ])
}
