import {
  getReadabilityStatus,
  ReadabilityStatus,
  setReadabilityContent,
  setReadabilityStatus,
} from "@renderer/atoms/readability"
import { useIntegrationSettingKey } from "@renderer/atoms/settings/integration"
import { whoami } from "@renderer/atoms/user"
import {
  SimpleIconsEagle,
  SimpleIconsInstapaper,
  SimpleIconsReadwise,
} from "@renderer/components/ui/platform-icon/icons"
import { COPY_MAP } from "@renderer/constants"
import { shortcuts } from "@renderer/constants/shortcuts"
import { tipcClient } from "@renderer/lib/client"
import { nextFrame } from "@renderer/lib/dom"
import { getOS } from "@renderer/lib/utils"
import type { CombinedEntryModel } from "@renderer/models"
import { useTipModal } from "@renderer/modules/wallet/hooks"
import type { FlatEntryModel } from "@renderer/store/entry"
import { entryActions } from "@renderer/store/entry"
import { useFeedById } from "@renderer/store/feed"
import { useMutation, useQuery } from "@tanstack/react-query"
import type { FetchError } from "ofetch"
import { ofetch } from "ofetch"
import type { ReactNode } from "react"
import { useCallback, useMemo } from "react"
import { toast } from "sonner"

export const useEntryReadabilityToggle = ({
  id,
  url,
}: {
  id: string
  url: string
}) =>
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
  type?: "toolbar" | "entryList"
}) => {
  const checkEagle = useQuery({
    queryKey: ["check-eagle"],
    enabled: !!entry?.entries.url && view !== undefined,
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
  const enableEagle = useIntegrationSettingKey("enableEagle")
  const enableReadwise = useIntegrationSettingKey("enableReadwise")
  const readwiseToken = useIntegrationSettingKey("readwiseToken")
  const enableInstapaper = useIntegrationSettingKey("enableInstapaper")
  const instapaperUsername = useIntegrationSettingKey("instapaperUsername")
  const instapaperPassword = useIntegrationSettingKey("instapaperPassword")

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
      onClick: () => void
    }[] = [
      {
        name: "Save media to Eagle",
        icon: <SimpleIconsEagle />,
        key: "saveToEagle",
        hide:
          !enableEagle ||
          (checkEagle.isLoading ? true : !checkEagle.data) ||
          !populatedEntry.entries.media?.length,
        onClick: async () => {
          if (
            !populatedEntry.entries.url ||
            !populatedEntry.entries.media?.length
          ) {
            return
          }
          const response = await tipcClient?.saveToEagle({
            url: populatedEntry.entries.url,
            mediaUrls: populatedEntry.entries.media.map((m) => m.url),
          })
          if (response?.status === "success") {
            toast.success("Saved to Eagle.", {
              duration: 3000,
            })
          } else {
            toast.error("Failed to save to Eagle.", {
              duration: 3000,
            })
          }
        },
      },
      {
        name: "Save to Readwise",
        icon: <SimpleIconsReadwise />,
        key: "saveToReadwise",
        hide: !enableReadwise || !readwiseToken || !populatedEntry.entries.url,
        onClick: async () => {
          try {
            const data = await ofetch("https://readwise.io/api/v3/save/", {
              method: "POST",
              headers: {
                Authorization: `Token ${readwiseToken}`,
              },
              body: {
                url: populatedEntry.entries.url,
                html: populatedEntry.entries.content || undefined,
                title: populatedEntry.entries.title || undefined,
                author: populatedEntry.entries.author || undefined,
                summary: populatedEntry.entries.description || undefined,
                published_date: populatedEntry.entries.publishedAt || undefined,
                image_url: populatedEntry.entries.media?.[0]?.url || undefined,
                saved_using: "Follow",
              },
            })
            toast.success(
              <>
                Saved to Readwise,
                {" "}
                <a target="_blank" className="underline" href={data.url}>
                  view
                </a>
              </>,
              {
                duration: 3000,
              },
            )
          } catch {
            toast.error("Failed to save to Readwise.", {
              duration: 3000,
            })
          }
        },
      },
      {
        name: "Save to Instapaper",
        icon: <SimpleIconsInstapaper />,
        key: "saveToInstapaper",
        hide:
          !enableInstapaper ||
          !instapaperPassword ||
          !instapaperUsername ||
          !populatedEntry.entries.url,
        onClick: async () => {
          try {
            const data = await ofetch("https://www.instapaper.com/api/add", {
              query: {
                url: populatedEntry.entries.url,
                title: populatedEntry.entries.title,
              },
              method: "POST",
              headers: {
                Authorization: `Basic ${btoa(
                  `${instapaperUsername}:${instapaperPassword}`,
                )}`,
              },
              parseResponse: JSON.parse,
            })
            toast.success(
              <>
                Saved to Instapaper,
                {" "}
                <a
                  target="_blank"
                  className="underline"
                  href={`https://www.instapaper.com/read/${data.bookmark_id}`}
                >
                  view
                </a>
              </>,
              {
                duration: 3000,
              },
            )
          } catch {
            toast.error("Failed to save to Instapaper.", {
              duration: 3000,
            })
          }
        },
      },
      {
        key: "tip",
        shortcut: shortcuts.entry.tip.key,
        name: `Tip`,
        className: "i-mgc-power-outline",
        hide: feed?.ownerUserId === whoami()?.id,
        onClick: () => {
          nextFrame(openTipModal)
        },
      },
      {
        key: "star",
        shortcut: shortcuts.entry.toggleStarred.key,
        name: `Star`,
        className: "i-mgc-star-cute-re",
        hide: !!populatedEntry.collections,
        onClick: () => {
          collect.mutate()
        },
      },
      {
        key: "unstar",
        name: `Unstar`,
        shortcut: shortcuts.entry.toggleStarred.key,
        className: "i-mgc-star-cute-fi text-orange-500",
        hide: !populatedEntry.collections,
        onClick: () => {
          uncollect.mutate()
        },
      },
      {
        key: "copyLink",
        name: "Copy link",
        className: "i-mgc-link-cute-re",
        hide: !populatedEntry.entries.url,
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
        name: COPY_MAP.OpenInBrowser(),
        shortcut: shortcuts.entry.openInBrowser.key,
        className: "i-mgc-world-2-cute-re",
        hide: !populatedEntry.entries.url,
        onClick: () => {
          if (!populatedEntry.entries.url) return
          window.open(populatedEntry.entries.url, "_blank")
        },
      },
      {
        name: "Share",
        key: "share",
        className:
          getOS() === "macOS" ?
            `i-mgc-share-3-cute-re` :
            "i-mgc-share-forward-cute-re",
        shortcut: shortcuts.entry.share.key,
        hide: !window.electron && !navigator.share,

        onClick: () => {
          if (!populatedEntry.entries.url) return

          if (window.electron) {
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
        name: `Mark as read`,
        shortcut: shortcuts.entry.toggleRead.key,
        className: "i-mgc-round-cute-fi",
        hide: !!(!!populatedEntry.read || populatedEntry.collections),
        onClick: () => {
          read.mutate(populatedEntry)
        },
      },
      {
        key: "unread",
        name: `Mark as unread`,
        shortcut: shortcuts.entry.toggleRead.key,
        className: "i-mgc-round-cute-re",
        hide: !!(!populatedEntry.read || populatedEntry.collections),
        onClick: () => {
          unread.mutate(populatedEntry)
        },
      },
    ]

    return items
  }, [
    populatedEntry,
    view,
    checkEagle.isLoading,
    checkEagle.data,
    openTipModal,
    collect,
    uncollect,
    read,
    unread,
    feed?.ownerUserId,
  ])

  return {
    items,
  }
}
