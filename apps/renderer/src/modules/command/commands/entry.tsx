import { FeedViewType } from "@follow/constants"
import type { CombinedEntryModel } from "@follow/models/types"
import { IN_ELECTRON } from "@follow/shared/constants"
import { nextFrame } from "@follow/utils/dom"
import { getOS } from "@follow/utils/utils"
import { useMutation } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"

import {
  setShowSourceContent,
  useShowSourceContent,
  useSourceContentModal,
} from "~/atoms/source-content"
import { whoami } from "~/atoms/user"
import { shortcuts } from "~/constants/shortcuts"
import { navigateEntry } from "~/hooks/biz/useNavigateEntry"
import { useRouteParams } from "~/hooks/biz/useRouteParams"
import { tipcClient } from "~/lib/client"
import { useTipModal } from "~/modules/wallet/hooks"
import { entryActions } from "~/store/entry"
import { useEntry, usePopulatedEntry } from "~/store/entry/hooks"
import { useFeedById } from "~/store/feed"
import { useInboxById } from "~/store/inbox"

import { useUserFocusValue } from "../contexts/focus"
import { useRegisterCommandEffect } from "../hooks/use-register-command-effect"
import { COMMAND_ID } from "./id"

const useCollect = () => {
  const { t } = useTranslation()
  return useMutation({
    mutationFn: async (entryId: string) => entryActions.markStar(entryId, true),

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
    mutationFn: async (entry: Nullable<CombinedEntryModel>) =>
      entry &&
      entry.feeds &&
      entryActions.markRead({
        feedId: entry.feeds.id,
        entryId: entry.entries.id,
        read: true,
      }),
  })

export const useUnread = () =>
  useMutation({
    mutationFn: async (entry: Nullable<CombinedEntryModel>) =>
      entry &&
      entry.feeds &&
      entryActions.markRead({
        feedId: entry.feeds.id,
        entryId: entry.entries.id,
        read: false,
      }),
  })

export const useRegisterEntryCommands = () => {
  const { t } = useTranslation()
  const { entryId: routeEntryId, isPendingEntry, view, listId } = useRouteParams()
  const layoutEntryId = isPendingEntry ? undefined : routeEntryId
  const userFocus = useUserFocusValue()
  const entryId = userFocus.type === "entry" ? userFocus.entryId : layoutEntryId
  const entry = useEntry(entryId)
  const feed = useFeedById(entry?.feedId)
  const inbox = useInboxById(entry?.inboxId)
  const isInbox = !!inbox
  const inList = !!listId

  const populatedEntry = usePopulatedEntry(entry, feed)

  const collect = useCollect()
  const uncollect = useUnCollect()
  const deleteInboxEntry = useDeleteInboxEntry()
  const showSourceContent = useShowSourceContent()
  const showSourceContentModal = useSourceContentModal()
  const openTipModal = useTipModal()
  const read = useRead()
  const unread = useUnread()

  useRegisterCommandEffect([
    {
      id: COMMAND_ID.entry.Tip,
      label: t("entry_actions.tip"),
      icon: <i className="i-mgc-power-outline" />,
      keyBinding: shortcuts.entry.tip.key,
      when: !isInbox && feed?.ownerUserId !== whoami()?.id && !!populatedEntry,
      run: () => {
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
      id: COMMAND_ID.entry.star,
      label: t("entry_actions.star"),
      icon: <i className="i-mgc-star-cute-re" />,
      keyBinding: shortcuts.entry.toggleStarred.key,
      when: !!populatedEntry && !populatedEntry.collections,
      run: () => {
        // if (type === "toolbar") {
        //   const absoluteStarAnimationUri = new URL(StarAnimationUri, import.meta.url).href
        //   mountLottie(absoluteStarAnimationUri, {
        //     x: e.clientX - 90,
        //     y: e.clientY - 70,
        //     height: 126,
        //     width: 252,
        //   })
        // }
        if (!populatedEntry) return
        collect.mutate(populatedEntry.entries.id)
      },
    },
    {
      id: COMMAND_ID.entry.unstar,
      label: t("entry_actions.unstar"),
      keyBinding: shortcuts.entry.toggleStarred.key,
      icon: <i className="i-mgc-star-cute-fi text-orange-500" />,
      when: !!populatedEntry && !!populatedEntry.collections,
      run: () => {
        if (!populatedEntry) return
        uncollect.mutate(populatedEntry.entries.id)
      },
    },
    {
      id: COMMAND_ID.entry.delete,
      label: t("entry_actions.delete"),
      icon: <i className="i-mgc-delete-2-cute-re" />,
      when: isInbox,
      run: () => {
        if (!populatedEntry) return
        deleteInboxEntry.mutate(populatedEntry.entries.id)
      },
    },
    {
      id: COMMAND_ID.entry.copyLink,
      label: t("entry_actions.copy_link"),
      icon: <i className="i-mgc-link-cute-re" />,
      when: !!populatedEntry && !!populatedEntry.entries.url,
      keyBinding: shortcuts.entry.copyLink.key,
      run: () => {
        if (!populatedEntry) return
        if (!populatedEntry.entries.url) return
        navigator.clipboard.writeText(populatedEntry.entries.url)
        toast(t("entry_actions.copied_notify", { which: t("words.link") }), {
          duration: 1000,
        })
      },
    },
    {
      id: COMMAND_ID.entry.copyTitle,
      label: t("entry_actions.copy_title"),
      icon: <i className="i-mgc-copy-cute-re" />,
      when: !!populatedEntry && !!populatedEntry.entries.title,
      keyBinding: shortcuts.entry.copyTitle.key,
      run: () => {
        if (!populatedEntry) return
        if (!populatedEntry.entries.title) return
        navigator.clipboard.writeText(populatedEntry.entries.title)
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
      keyBinding: shortcuts.entry.openInBrowser.key,
      icon: <i className="i-mgc-world-2-cute-re" />,
      when: !!populatedEntry && !!populatedEntry.entries.url,
      run: () => {
        if (!populatedEntry) return
        if (!populatedEntry.entries.url) return
        window.open(populatedEntry.entries.url, "_blank")
      },
    },
    {
      id: COMMAND_ID.entry.viewSourceContent,
      label: t("entry_actions.view_source_content"),
      icon: <i className="i-mgc-world-2-cute-re" />,
      when: !showSourceContent && !!populatedEntry && !!populatedEntry.entries.url,
      run: () => {
        if (!populatedEntry) return
        if (!populatedEntry.entries.url) return
        const viewPreviewInModal = [
          FeedViewType.SocialMedia,
          FeedViewType.Videos,
          FeedViewType.Pictures,
        ].includes(view)
        if (viewPreviewInModal) {
          showSourceContentModal({
            title: populatedEntry.entries.title ?? undefined,
            src: populatedEntry.entries.url,
          })
          return
        }
        if (layoutEntryId !== populatedEntry.entries.id) {
          navigateEntry({ entryId: populatedEntry.entries.id })
        }
        setShowSourceContent(true)
      },
    },
    {
      id: COMMAND_ID.entry.viewEntryContent,
      label: t("entry_actions.view_source_content"),
      icon: <i className="i-mgc-world-2-cute-fi" />,
      when: showSourceContent,
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
      keyBinding: shortcuts.entry.share.key,
      when: !!populatedEntry && !!populatedEntry.entries.url && "share" in navigator,
      run: () => {
        if (!populatedEntry) return
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
      id: COMMAND_ID.entry.read,
      label: t("entry_actions.mark_as_read"),
      keyBinding: shortcuts.entry.toggleRead.key,
      icon: <i className="i-mgc-round-cute-fi" />,
      when: !!populatedEntry && !populatedEntry.read && !populatedEntry.collections && !inList,
      run: () => {
        read.mutate(populatedEntry)
      },
    },
    {
      id: COMMAND_ID.entry.unread,
      label: t("entry_actions.mark_as_unread"),
      keyBinding: shortcuts.entry.toggleRead.key,
      icon: <i className="i-mgc-round-cute-re" />,
      when: !!populatedEntry && !!populatedEntry.read && !populatedEntry.collections && !inList,
      run: () => {
        unread.mutate(populatedEntry)
      },
    },
  ])
}
