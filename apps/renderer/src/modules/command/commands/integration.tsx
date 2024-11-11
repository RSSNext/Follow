import {
  SimpleIconsEagle,
  SimpleIconsInstapaper,
  SimpleIconsObsidian,
  SimpleIconsOmnivore,
  SimpleIconsOutline,
  SimpleIconsReadwise,
} from "@follow/components/ui/platform-icon/icons.js"
import { IN_ELECTRON } from "@follow/shared/constants"
import { useMutation, useQuery } from "@tanstack/react-query"
import type { FetchError } from "ofetch"
import { ofetch } from "ofetch"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"

import { getReadabilityContent, getReadabilityStatus, ReadabilityStatus } from "~/atoms/readability"
import { useIntegrationSettingKey } from "~/atoms/settings/integration"
import { useRouteParams } from "~/hooks/biz/useRouteParams"
import { tipcClient } from "~/lib/client"
import { parseHtml } from "~/lib/parse-html"
import { useEntry, usePopulatedEntry } from "~/store/entry/hooks"
import { useFeedById } from "~/store/feed"

import { useUserFocusValue } from "../contexts/focus"
import { useRegisterCommandEffect } from "../hooks/use-register-command-effect"
import { COMMAND_ID } from "./id"

export const useRegisterIntegrationCommands = () => {
  useRegisterEagleCommands()
  useRegisterReadwiseCommands()
  useRegisterInstapaperCommands()
  useRegisterOmnivoreCommands()
  useRegisterObsidianCommands()
  useRegisterOutlineCommands()
}

const useRegisterEagleCommands = () => {
  const { t } = useTranslation()
  const { entryId: layoutEntryId, view } = useRouteParams()
  const userFocus = useUserFocusValue()
  const entryId = userFocus.type === "entry" ? userFocus.entryId : layoutEntryId

  const entry = useEntry(entryId)
  const feed = useFeedById(entry?.feedId)
  const enableEagle = useIntegrationSettingKey("enableEagle")
  const contextPopulatedEntry = usePopulatedEntry(entry, feed)

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

  const isEagleAvailable = enableEagle && (checkEagle.isLoading ? false : !!checkEagle.data)

  useRegisterCommandEffect(
    !isEagleAvailable
      ? []
      : {
          id: COMMAND_ID.integration.saveToEagle,
          label: t("entry_actions.save_media_to_eagle"),
          icon: <SimpleIconsEagle />,
          when:
            !!contextPopulatedEntry?.entries?.url &&
            !!contextPopulatedEntry?.entries?.media?.length,
          // TODO get entry based on context
          run: async () => {
            const populatedEntry = contextPopulatedEntry
            if (
              !populatedEntry ||
              !populatedEntry.entries.url ||
              !populatedEntry.entries.media?.length
            ) {
              toast.error('Failed to save to Eagle: "url" or "media" is not available', {
                duration: 3000,
              })
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
  )
}

const useRegisterReadwiseCommands = () => {
  const { t } = useTranslation()
  const { entryId: layoutEntryId } = useRouteParams()
  const userFocus = useUserFocusValue()
  const entryId = userFocus.type === "entry" ? userFocus.entryId : layoutEntryId

  const entry = useEntry(entryId)
  const feed = useFeedById(entry?.feedId)
  const populatedEntry = usePopulatedEntry(entry, feed)

  const enableReadwise = useIntegrationSettingKey("enableReadwise")
  const readwiseToken = useIntegrationSettingKey("readwiseToken")

  const isReadwiseAvailable = enableReadwise && !!readwiseToken

  useRegisterCommandEffect(
    !isReadwiseAvailable
      ? []
      : {
          id: COMMAND_ID.integration.saveToReadwise,
          label: t("entry_actions.save_to_readwise"),
          icon: <SimpleIconsReadwise />,
          when: !!populatedEntry && !!populatedEntry.entries.url,
          run: async () => {
            if (!populatedEntry) return
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
  )
}

const useRegisterInstapaperCommands = () => {
  const { t } = useTranslation()
  const { entryId: layoutEntryId } = useRouteParams()
  const userFocus = useUserFocusValue()
  const entryId = userFocus.type === "entry" ? userFocus.entryId : layoutEntryId

  const entry = useEntry(entryId)
  const feed = useFeedById(entry?.feedId)
  const populatedEntry = usePopulatedEntry(entry, feed)

  const enableInstapaper = useIntegrationSettingKey("enableInstapaper")
  const instapaperUsername = useIntegrationSettingKey("instapaperUsername")
  const instapaperPassword = useIntegrationSettingKey("instapaperPassword")

  const isInstapaperAvailable = enableInstapaper && !!instapaperPassword && !!instapaperUsername

  useRegisterCommandEffect(
    !isInstapaperAvailable
      ? []
      : {
          id: COMMAND_ID.integration.saveToInstapaper,
          label: t("entry_actions.save_to_instapaper"),
          icon: <SimpleIconsInstapaper />,
          when: !!populatedEntry && !!populatedEntry.entries.url,
          run: async () => {
            if (!populatedEntry) return
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
  )
}

const useRegisterOmnivoreCommands = () => {
  const { t } = useTranslation()
  const { entryId: layoutEntryId } = useRouteParams()
  const userFocus = useUserFocusValue()
  const entryId = userFocus.type === "entry" ? userFocus.entryId : layoutEntryId

  const entry = useEntry(entryId)
  const feed = useFeedById(entry?.feedId)
  const populatedEntry = usePopulatedEntry(entry, feed)

  const enableOmnivore = useIntegrationSettingKey("enableOmnivore")
  const omnivoreToken = useIntegrationSettingKey("omnivoreToken")
  const omnivoreEndpoint = useIntegrationSettingKey("omnivoreEndpoint")

  const isOmnivoreAvailable = enableOmnivore && !!omnivoreToken && !!omnivoreEndpoint

  useRegisterCommandEffect(
    !isOmnivoreAvailable
      ? []
      : {
          id: COMMAND_ID.integration.saveToOmnivore,
          label: t("entry_actions.save_to_omnivore"),
          icon: <SimpleIconsOmnivore />,
          when: !!populatedEntry && !!populatedEntry.entries.url,
          run: async () => {
            if (!populatedEntry) return
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
  )
}

const useRegisterObsidianCommands = () => {
  const { t } = useTranslation()
  const { entryId: layoutEntryId } = useRouteParams()
  const userFocus = useUserFocusValue()
  const entryId = userFocus.type === "entry" ? userFocus.entryId : layoutEntryId

  const entry = useEntry(entryId)
  const feed = useFeedById(entry?.feedId)
  const populatedEntry = usePopulatedEntry(entry, feed)

  const enableObsidian = useIntegrationSettingKey("enableObsidian")
  const obsidianVaultPath = useIntegrationSettingKey("obsidianVaultPath")
  const isObsidianAvailable = enableObsidian && !!obsidianVaultPath

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

  useRegisterCommandEffect(
    !IN_ELECTRON || !isObsidianAvailable
      ? []
      : {
          id: COMMAND_ID.integration.saveToObsidian,
          label: t("entry_actions.save_to_obsidian"),
          icon: <SimpleIconsObsidian />,
          when: !!populatedEntry?.entries?.url,
          run: () => {
            if (!populatedEntry?.entries?.url) return

            const isReadabilityReady =
              getReadabilityStatus()[populatedEntry.entries.id] === ReadabilityStatus.SUCCESS
            const content =
              (isReadabilityReady
                ? getReadabilityContent()[populatedEntry.entries.id].content
                : populatedEntry.entries.content) || ""
            const markdownContent = parseHtml(content).toMarkdown()
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
  )
}

const useRegisterOutlineCommands = () => {
  const { t } = useTranslation()
  const { entryId: layoutEntryId } = useRouteParams()
  const userFocus = useUserFocusValue()
  const entryId = userFocus.type === "entry" ? userFocus.entryId : layoutEntryId

  const entry = useEntry(entryId)
  const feed = useFeedById(entry?.feedId)
  const populatedEntry = usePopulatedEntry(entry, feed)

  const enableOutline = useIntegrationSettingKey("enableOutline")
  const outlineEndpoint = useIntegrationSettingKey("outlineEndpoint")
  const outlineToken = useIntegrationSettingKey("outlineToken")
  const outlineCollection = useIntegrationSettingKey("outlineCollection")
  const outlineAvailable =
    enableOutline && !!outlineToken && !!outlineEndpoint && !!outlineCollection

  useRegisterCommandEffect(
    !IN_ELECTRON || !outlineAvailable
      ? []
      : {
          id: COMMAND_ID.integration.saveToOutline,
          label: t("entry_actions.save_to_outline"),
          icon: <SimpleIconsOutline />,
          when: !!populatedEntry && !!populatedEntry.entries.title,
          run: async () => {
            if (!populatedEntry?.entries?.url) return

            const getEntryContentAsMarkdown = () => {
              const isReadabilityReady =
                getReadabilityStatus()[populatedEntry.entries.id] === ReadabilityStatus.SUCCESS
              const content =
                (isReadabilityReady
                  ? getReadabilityContent()[populatedEntry.entries.id].content
                  : populatedEntry.entries.content) || ""
              return parseHtml(content).toMarkdown()
            }

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
  )
}
