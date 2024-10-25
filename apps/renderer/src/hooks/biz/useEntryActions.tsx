import {
  SimpleIconsEagle,
  SimpleIconsInstapaper,
  SimpleIconsObsidian,
  SimpleIconsOmnivore,
  SimpleIconsReadwise,
} from "@follow/components/ui/platform-icon/icons.js"
import { FeedViewType } from "@follow/constants"
import type { CombinedEntryModel } from "@follow/models/types"
import { IN_ELECTRON } from "@follow/shared/constants"
import { nextFrame } from "@follow/utils/dom"
import { getOS } from "@follow/utils/utils"
import { useMutation, useQuery } from "@tanstack/react-query"
import type { FetchError } from "ofetch"
import { ofetch } from "ofetch"
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
import { useIntegrationSettingKey } from "~/atoms/settings/integration"
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
import { parseHtml } from "~/lib/parse-html"
import StarAnimationUri from "~/lottie/star.lottie?url"
import { useTipModal } from "~/modules/wallet/hooks"
import type { FlatEntryModel } from "~/store/entry"
import { entryActions } from "~/store/entry"
import { useFeedById } from "~/store/feed"

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
    mutationFn: async (entry: Nullable<CombinedEntryModel>) =>
      entry &&
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
      entryActions.markRead({
        feedId: entry.feeds.id,
        entryId: entry.entries.id,
        read: false,
      }),
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
}: {
  view?: number
  entry?: FlatEntryModel | null
  type?: "toolbar" | "entryList"
}) => {
  const { t } = useTranslation()

  const feed = useFeedById(entry?.feedId)
  const isInbox = feed?.type === "inbox"

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
    entryId: populatedEntry?.entries.id ?? undefined,
  })

  const showSourceContent = useShowSourceContent()
  const showSourceContentModal = useSourceContentModal()

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
  const enableOmnivore = useIntegrationSettingKey("enableOmnivore")
  const omnivoreToken = useIntegrationSettingKey("omnivoreToken")
  const omnivoreEndpoint = useIntegrationSettingKey("omnivoreEndpoint")
  const enableObsidian = useIntegrationSettingKey("enableObsidian")
  const obsidianVaultPath = useIntegrationSettingKey("obsidianVaultPath")
  const isObsidianEnabled = enableObsidian && !!obsidianVaultPath

  const saveToObsidian = useMutation({
    mutationKey: ["save-to-obsidian"],
    mutationFn: async (data: {
      url: string
      title: string
      content: string
      author: string
      publishedAt: string
      vaultPath: string
    }) => {
      return await tipcClient?.saveToObsidian(data)
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.success(t("entry_actions.saved_to_obsidian"), {
          duration: 3000,
        })
      } else {
        toast.error(`${t("entry_actions.failed_to_save_to_obsidian")}: ${data?.error}`, {
          duration: 3000,
        })
      }
    },
  })

  const checkEagle = useQuery({
    queryKey: ["check-eagle"],
    enabled: ELECTRON && enableEagle && !!entry?.entries.url && view !== undefined,
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
      {
        name: t("entry_actions.save_media_to_eagle"),
        icon: <SimpleIconsEagle />,
        key: "saveToEagle",
        hide:
          !enableEagle ||
          (checkEagle.isLoading ? true : !checkEagle.data) ||
          !populatedEntry.entries.media?.length,
        onClick: async () => {
          if (!populatedEntry.entries.url || !populatedEntry.entries.media?.length) {
            return
          }
          const response = await tipcClient?.saveToEagle({
            url: populatedEntry.entries.url,
            mediaUrls: populatedEntry.entries.media.map((m) => m.url),
          })
          if (response?.status === "success") {
            toast.success(t("entry_actions.saved_to_eagle"), {
              duration: 3000,
            })
          } else {
            toast.error(t("entry_actions.failed_to_save_to_eagle"), {
              duration: 3000,
            })
          }
        },
      },
      {
        name: t("entry_actions.save_to_readwise"),
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
                {t("entry_actions.saved_to_readwise")},{" "}
                <a target="_blank" className="underline" href={data.url}>
                  view
                </a>
              </>,
              {
                duration: 3000,
              },
            )
          } catch {
            toast.error(t("entry_actions.failed_to_save_to_readwise"), {
              duration: 3000,
            })
          }
        },
      },
      {
        name: t("entry_actions.save_to_instapaper"),
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
                Authorization: `Basic ${btoa(`${instapaperUsername}:${instapaperPassword}`)}`,
              },
              parseResponse: JSON.parse,
            })
            toast.success(
              <>
                {t("entry_actions.saved_to_instapaper")},{" "}
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
            toast.error(t("entry_actions.failed_to_save_to_instapaper"), {
              duration: 3000,
            })
          }
        },
      },
      {
        name: t("entry_actions.save_to_omnivore"),
        icon: <SimpleIconsOmnivore />,
        key: "saveToomnivore",
        hide: !enableOmnivore || !omnivoreToken || !omnivoreEndpoint || !populatedEntry.entries.url,
        onClick: async () => {
          const saveUrlQuery = `
  mutation SaveUrl($input: SaveUrlInput!) {
    saveUrl(input: $input) {
      ... on SaveSuccess {
        url
        clientRequestId
      }
      ... on SaveError {
        errorCodes
        message
      }
    }
  }
`

          try {
            const data = await ofetch(omnivoreEndpoint, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: omnivoreToken,
              },
              body: {
                query: saveUrlQuery,
                variables: {
                  input: {
                    url: populatedEntry.entries.url,
                    source: "Follow",
                    clientRequestId: globalThis.crypto.randomUUID(),
                    publishedAt: new Date(populatedEntry.entries.publishedAt),
                  },
                },
              },
            })
            toast.success(
              <>
                {t("entry_actions.saved_to_omnivore")},{" "}
                <a target="_blank" className="underline" href={data.data.saveUrl.url}>
                  view
                </a>
              </>,
              {
                duration: 3000,
              },
            )
          } catch {
            toast.error(t("entry_actions.failed_to_save_to_omnivore"), {
              duration: 3000,
            })
          }
        },
      },
      {
        name: t("entry_actions.save_to_obsidian"),
        icon: <SimpleIconsObsidian />,
        key: "saveToObsidian",
        hide: !isObsidianEnabled || !populatedEntry?.entries?.url || !IN_ELECTRON,
        onClick: () => {
          if (!isObsidianEnabled || !populatedEntry?.entries?.url || !IN_ELECTRON) return

          saveToObsidian.mutate({
            url: populatedEntry.entries.url,
            title: populatedEntry.entries.title || "",
            content: parseHtml(populatedEntry.entries.content || "").toMarkdown(),
            author: populatedEntry.entries.author || "",
            publishedAt: populatedEntry.entries.publishedAt || "",
            vaultPath: obsidianVaultPath,
          })
        },
      },
      {
        key: "tip",
        shortcut: shortcuts.entry.tip.key,
        name: t("entry_actions.tip"),
        className: "i-mgc-power-outline",
        hide: isInbox || feed?.ownerUserId === whoami()?.id,
        onClick: () => {
          nextFrame(openTipModal)
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
        hide: !!(!!populatedEntry.read || populatedEntry.collections),
        onClick: () => {
          read.mutate(populatedEntry)
        },
      },
      {
        key: "unread",
        name: t("entry_actions.mark_as_unread"),
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
    t,
    enableEagle,
    checkEagle.isLoading,
    checkEagle.data,
    enableReadwise,
    readwiseToken,
    enableInstapaper,
    instapaperPassword,
    instapaperUsername,
    enableOmnivore,
    omnivoreToken,
    omnivoreEndpoint,
    isObsidianEnabled,
    isInbox,
    feed?.ownerUserId,
    type,
    showSourceContent,
    saveToObsidian,
    obsidianVaultPath,
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
