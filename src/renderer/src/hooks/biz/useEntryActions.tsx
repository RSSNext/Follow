import { tipcClient } from "@renderer/lib/client"
import { nextFrame } from "@renderer/lib/dom"
import { shortcuts } from "@renderer/lib/shortcuts"
import type { CombinedEntryModel } from "@renderer/models"
import { useTipModal } from "@renderer/modules/wallet/hooks"
import type { FlatEntryModel } from "@renderer/store/entry"
import { entryActions } from "@renderer/store/entry"
import { useFeedById } from "@renderer/store/feed"
import { useMutation, useQuery } from "@tanstack/react-query"
import type { FetchError } from "ofetch"
import { ofetch } from "ofetch"
import { useMemo } from "react"
import { toast } from "sonner"

export const useCollect = (entry: Nullable<CombinedEntryModel>) =>
  useMutation({
    mutationFn: async () =>
      entry && entryActions.markStar(entry.entries.id, true),

    onSuccess: () => {
      toast.success("Starred.", {
        duration: 1000,
      })
    },
  })

export const useUnCollect = (entry: Nullable<CombinedEntryModel>) =>
  useMutation({
    mutationFn: async () =>
      entry && entryActions.markStar(entry.entries.id, false),

    onSuccess: () => {
      toast.success("Unstarred.", {
        duration: 1000,
      })
    },
  })

export const useRead = () =>
  useMutation({
    mutationFn: async (entry: Nullable<CombinedEntryModel>) =>
      entry && entryActions.markRead(entry.feeds.id, entry.entries.id, true),
  })
export const useUnread = () =>
  useMutation({
    mutationFn: async (entry: Nullable<CombinedEntryModel>) =>
      entry && entryActions.markRead(entry.feeds.id, entry.entries.id, false),
  })

export const useEntryActions = ({
  view,
  entry,
}: {
  view?: number
  entry?: FlatEntryModel | null
}) => {
  const checkEagle = useQuery({
    queryKey: ["check-eagle"],
    enabled: !!entry?.entries.url && !!view,
    queryFn: async () => {
      try {
        await ofetch("http://localhost:41595")
        return true
      } catch (error: unknown) {
        return (error as FetchError).data?.code === 401
      }
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })

  const feed = useFeedById(entry?.feedId)

  const populatedEntry = useMemo(() => {
    if (!entry) return null
    if (!feed) return null
    return {
      ...entry,
      feeds: feed!,
    } as CombinedEntryModel
  }, [entry, feed])

  const openTipModal = useTipModal({
    userId: populatedEntry?.feeds.ownerUserId ?? undefined,
    feedId: populatedEntry?.feeds.id ?? undefined,
  })

  const collect = useCollect(populatedEntry)
  const uncollect = useUnCollect(populatedEntry)
  const read = useRead()
  const unread = useUnread()

  const items = useMemo(() => {
    if (!populatedEntry || view === undefined) return []
    const items = [
      [
        {
          key: "tip",
          shortcut: shortcuts.entry.tip.key,
          name: `Tip`,
          className: "i-mgc-power-outline",
          onClick: () => {
            nextFrame(openTipModal)
          },
        },
        {
          key: "star",
          shortcut: shortcuts.entry.toggleStarred.key,
          name: `Star`,
          className: "i-mgc-star-cute-re",
          disabled: !!populatedEntry.collections,
          onClick: () => {
            collect.mutate()
          },
        },
        {
          key: "unstar",
          name: `Unstar`,
          shortcut: shortcuts.entry.toggleStarred.key,
          className: "i-mgc-star-cute-fi text-orange-500",
          disabled: !populatedEntry.collections,
          onClick: () => {
            uncollect.mutate()
          },
        },
        {
          name: "Copy Link",
          className: "i-mgc-link-cute-re",
          disabled: !populatedEntry.entries.url,
          shortcut: shortcuts.entry.copyLink.key,
          onClick: () => {
            if (!populatedEntry.entries.url) return
            navigator.clipboard.writeText(populatedEntry.entries.url)
            toast("Link copied to clipboard.", {
              duration: 1000,
            })
          },
        },
        {
          key: "openInBrowser",
          name: `Open in Browser`,
          shortcut: shortcuts.entry.openInBrowser.key,
          className: "i-mgc-world-2-cute-re",
          disabled: !populatedEntry.entries.url,
          onClick: () => {
            if (!populatedEntry.entries.url) return
            window.open(populatedEntry.entries.url, "_blank")
          },
        },
        {
          name: "Save Images to Eagle",
          icon: "/eagle.svg",
          disabled:
            (checkEagle.isLoading ? true : !checkEagle.data) ||
            !populatedEntry.entries.images?.length,
          onClick: async () => {
            if (
              !populatedEntry.entries.url ||
              !populatedEntry.entries.images?.length
            ) {
              return
            }
            const response = await tipcClient?.saveToEagle({
              url: populatedEntry.entries.url,
              images: populatedEntry.entries.images,
            })
            if (response?.status === "success") {
              toast("Saved to Eagle.", {
                duration: 3000,
              })
            } else {
              toast("Failed to save to Eagle.", {
                duration: 3000,
              })
            }
          },
        },
        {
          name: "Share",
          className: "i-mgc-share-forward-cute-re",
          disabled:
            !window.electron || !navigator.share,
          onClick: () => {
            if (!populatedEntry.entries.url) return

            if (window.electron) {
              return tipcClient?.showShareMenu(populatedEntry.entries.url)
            } else {
              navigator.share({
                url: populatedEntry.entries.url,
              })
            }
          },
        },
        {
          key: "read",
          name: `Mark as Read`,
          shortcut: shortcuts.entry.toggleRead.key,
          className: "i-mgc-round-cute-fi",
          disabled: !!populatedEntry.read || populatedEntry.collections,
          onClick: () => {
            read.mutate(populatedEntry)
          },
        },
        {
          key: "unread",
          name: `Mark as Unread`,
          shortcut: shortcuts.entry.toggleRead.key,
          className: "i-mgc-round-cute-re",
          disabled: !populatedEntry.read || populatedEntry.collections,
          onClick: () => {
            unread.mutate(populatedEntry)
          },
        },
      ],
    ]

    return items[view] || items[0]
  }, [
    checkEagle.data,
    checkEagle.isLoading,
    collect,
    populatedEntry,
    read,
    openTipModal,
    uncollect,
    unread,
    view,
  ])

  return {
    items,
  }
}
