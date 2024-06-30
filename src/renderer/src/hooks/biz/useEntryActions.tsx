import { apiClient } from "@renderer/lib/api-fetch"
import { tipcClient } from "@renderer/lib/client"
import { nextFrame } from "@renderer/lib/dom"
import { shortcuts } from "@renderer/lib/shortcuts"
import type { CombinedEntryModel } from "@renderer/models"
import { useTipModal } from "@renderer/modules/wallet/hooks"
import { entryActions } from "@renderer/store"
import { useMutation, useQuery } from "@tanstack/react-query"
import type { FetchError } from "ofetch"
import { ofetch } from "ofetch"
import { useMemo } from "react"
import { toast } from "sonner"

export const useCollect = (entry: Nullable<CombinedEntryModel>) =>
  useMutation({
    mutationFn: async () =>
      entry &&
      apiClient.collections.$post({
        json: {
          entryId: entry?.entries.id,
        },
      }),

    onMutate() {
      if (!entry) return
      entryActions.markStar(entry.entries.id, true)
    },
    onSuccess: () => {
      toast.success("Starred.", {
        duration: 1000,
      })
    },
  })

export const useUnCollect = (entry: Nullable<CombinedEntryModel>) =>
  useMutation({
    mutationFn: async () =>
      entry &&
      apiClient.collections.$delete({
        json: {
          entryId: entry?.entries.id,
        },
      }),

    onMutate() {
      if (!entry) return
      entryActions.markStar(entry.entries.id, false)
    },
    onSuccess: () => {
      toast.success("Unstarred.", {
        duration: 1000,
      })
    },
  })

export const useRead = () =>
  useMutation({
    mutationFn: async (entry: Nullable<CombinedEntryModel>) =>
      entry &&
      apiClient.reads.$post({
        json: {
          entryIds: [entry.entries.id],
        },
      }),

    onMutate: (entry: Nullable<CombinedEntryModel>) => {
      if (!entry) return

      entryActions.markRead(entry.feeds.id, entry.entries.id, true)
    },
  })
export const useUnread = () =>
  useMutation({
    mutationFn: async (entry: Nullable<CombinedEntryModel>) =>
      entry &&
      apiClient.reads.$delete({
        json: {
          entryId: entry.entries.id,
        },
      }),

    onMutate: (entry: Nullable<CombinedEntryModel>) => {
      if (!entry) return

      entryActions.markRead(entry.feeds.id, entry.entries.id, false)
    },
  })

export const useEntryActions = ({
  view,
  entry,
}: {
  view?: number
  entry?: CombinedEntryModel | null
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

  const openTipModal = useTipModal({
    userId: entry?.feeds.ownerUserId ?? undefined,
    feedId: entry?.feeds.id ?? undefined,
  })

  const collect = useCollect(entry)
  const uncollect = useUnCollect(entry)
  const read = useRead()
  const unread = useUnread()

  const items = useMemo(() => {
    if (!entry || view === undefined) return []
    const items = [
      [
        {
          key: "tip",
          shortcut: shortcuts.entry.tip.key,
          name: `Tip Power`,
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
          disabled: !!entry.collections,
          onClick: () => {
            collect.mutate()
          },
        },
        {
          key: "unstar",
          name: `Unstar`,
          shortcut: shortcuts.entry.toggleStarred.key,
          className: "i-mgc-star-cute-fi text-orange-500",
          disabled: !entry.collections,
          onClick: () => {
            uncollect.mutate()
          },
        },
        {
          name: "Copy Link",
          className: "i-mgc-link-cute-re",
          disabled: !entry.entries.url,
          shortcut: shortcuts.entry.copyLink.key,
          onClick: () => {
            if (!entry.entries.url) return
            navigator.clipboard.writeText(entry.entries.url)
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
          disabled: !entry.entries.url,
          onClick: () => {
            if (!entry.entries.url) return
            window.open(entry.entries.url, "_blank")
          },
        },
        {
          name: "Save Images to Eagle",
          icon: "/eagle.svg",
          disabled:
            (checkEagle.isLoading ? true : !checkEagle.data) ||
            !entry.entries.images?.length,
          onClick: async () => {
            if (!entry.entries.url || !entry.entries.images?.length) return
            const response = await tipcClient?.saveToEagle({
              url: entry.entries.url,
              images: entry.entries.images,
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
          onClick: () => {
            if (!entry.entries.url) return
            tipcClient?.showShareMenu(entry.entries.url)
          },
        },
        {
          key: "read",
          name: `Mark as Read`,
          shortcut: shortcuts.entry.toggleRead.key,
          className: "i-mgc-round-cute-fi",
          disabled: !!entry.read,
          onClick: () => {
            read.mutate(entry)
          },
        },
        {
          key: "unread",
          name: `Mark as Unread`,
          shortcut: shortcuts.entry.toggleRead.key,
          className: "i-mgc-round-cute-re",
          disabled: !entry.read,
          onClick: () => {
            unread.mutate(entry)
          },
        },
      ],
    ]

    return items[view] || items[0]
  }, [
    checkEagle.data,
    checkEagle.isLoading,
    collect,
    entry,
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
