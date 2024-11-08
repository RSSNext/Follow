import {
  SimpleIconsEagle,
  SimpleIconsInstapaper,
  SimpleIconsObsidian,
  SimpleIconsOmnivore,
  SimpleIconsOutline,
  SimpleIconsReadwise,
} from "@follow/components/ui/platform-icon/icons.js"
import type { CombinedEntryModel } from "@follow/models/types"
import { IN_ELECTRON } from "@follow/shared/constants"
import { useMutation, useQuery } from "@tanstack/react-query"
import type { FetchError } from "ofetch"
import { ofetch } from "ofetch"
import type { ReactNode } from "react"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"

import { getReadabilityContent, getReadabilityStatus, ReadabilityStatus } from "~/atoms/readability"
import { useIntegrationSettingValue } from "~/atoms/settings/integration"
import { tipcClient } from "~/lib/client"
import { parseHtml } from "~/lib/parse-html"
import type { FlatEntryModel } from "~/store/entry"
import { getFeedById, useFeedById } from "~/store/feed"
import { useInboxById } from "~/store/inbox"

export const useIntegrationActions = ({
  view,
  entry,
}: {
  view?: number
  entry?: FlatEntryModel | null
}) => {
  const { t } = useTranslation()

  const feed = useFeedById(entry?.feedId, (feed) => {
    return {
      type: feed.type,
      ownerUserId: feed.ownerUserId,
      id: feed.id,
    }
  })

  const inbox = useInboxById(entry?.inboxId)

  const populatedEntry = useMemo(() => {
    if (!entry) return null
    if (!feed?.id && !inbox?.id) return null

    return {
      ...entry,
      feeds: feed ? getFeedById(feed.id) : undefined,
      inboxes: inbox,
    } as CombinedEntryModel
  }, [entry, feed, inbox])

  const {
    enableEagle,
    enableReadwise,
    enableInstapaper,
    enableOmnivore,
    enableObsidian,
    enableOutline,
    readwiseToken,
    instapaperUsername,
    instapaperPassword,
    omnivoreToken,
    omnivoreEndpoint,
    obsidianVaultPath,
    outlineToken,
    outlineEndpoint,
    outlineCollection,
  } = useIntegrationSettingValue()
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

  const items = useMemo(() => {
    if (!populatedEntry || view === undefined) return []

    const getEntryContentAsMarkdown = () => {
      const isReadabilityReady =
        getReadabilityStatus()[populatedEntry.entries.id] === ReadabilityStatus.SUCCESS
      const content =
        (isReadabilityReady
          ? getReadabilityContent()[populatedEntry.entries.id].content
          : populatedEntry.entries.content) || ""
      return parseHtml(content).toMarkdown()
    }

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
          window.analytics?.capture("integration", {
            type: "eagle",
            event: "save",
          })
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
            window.analytics?.capture("integration", {
              type: "readwise",
              event: "save",
            })
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
            window.analytics?.capture("integration", {
              type: "instapaper",
              event: "save",
            })
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

          window.analytics?.capture("integration", {
            type: "omnivore",
            event: "save",
          })
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

          const markdownContent = getEntryContentAsMarkdown()
          window.analytics?.capture("integration", {
            type: "obsidian",
            event: "save",
          })
          saveToObsidian.mutate({
            url: populatedEntry.entries.url,
            title: populatedEntry.entries.title || "",
            content: markdownContent,
            author: populatedEntry.entries.author || "",
            publishedAt: populatedEntry.entries.publishedAt || "",
            vaultPath: obsidianVaultPath,
          })
        },
      },
      {
        name: t("entry_actions.save_to_outline"),
        icon: <SimpleIconsOutline />,
        key: "saveToOutline",
        hide:
          !IN_ELECTRON ||
          !enableOutline ||
          !outlineToken ||
          !outlineEndpoint ||
          !outlineCollection ||
          !populatedEntry.entries.title,
        onClick: async () => {
          try {
            const request = async (method: string, params: Record<string, unknown>) => {
              return await ofetch(`${outlineEndpoint.replace(/\/$/, "")}/${method}`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${outlineToken}`,
                },
                body: params,
              })
            }
            let collectionId = outlineCollection
            if (!/^[a-f\d]{8}(?:-[a-f\d]{4}){3}-[a-f\d]{12}$/i.test(collectionId)) {
              const collection = await request("collections.info", {
                id: collectionId,
              })
              collectionId = collection.data.id
            }
            const markdownContent = getEntryContentAsMarkdown()
            await request("documents.create", {
              title: populatedEntry.entries.title,
              text: markdownContent,
              collectionId,
              publish: true,
            })
            toast.success(t("entry_actions.saved_to_outline"), {
              duration: 3000,
            })
          } catch {
            toast.error(t("entry_actions.failed_to_save_to_outline"), {
              duration: 3000,
            })
          }
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
    enableOutline,
    outlineToken,
    outlineEndpoint,
    outlineCollection,
    saveToObsidian,
    obsidianVaultPath,
  ])

  return {
    items,
  }
}
