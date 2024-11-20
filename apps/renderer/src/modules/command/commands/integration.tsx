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
import type { FlatEntryModel } from "~/store/entry"
import { useEntryStore } from "~/store/entry"

import { useRegisterCommandEffect } from "../hooks/use-register-command"
import { defineFollowCommand } from "../registry/command"
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
  const { view } = useRouteParams()

  const enableEagle = useIntegrationSettingKey("enableEagle")

  const checkEagle = useQuery({
    queryKey: ["check-eagle"],
    enabled: ELECTRON && enableEagle && view !== undefined,
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
      : defineFollowCommand({
          id: COMMAND_ID.integration.saveToEagle,
          label: t("entry_actions.save_media_to_eagle"),
          icon: <SimpleIconsEagle />,
          run: async ({ entryId }) => {
            const entry = useEntryStore.getState().flatMapEntries[entryId]
            if (!entry) {
              toast.error("Failed to save to Eagle: entry is not available", {
                duration: 3000,
              })
              return
            }
            if (!entry.entries.url || !entry.entries.media?.length) {
              toast.error('Failed to save to Eagle: "url" or "media" is not available', {
                duration: 3000,
              })
              return
            }
            const response = await tipcClient?.saveToEagle({
              url: entry.entries.url,
              mediaUrls: entry.entries.media.map((m) => m.url),
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
        }),
  )
}

const useRegisterReadwiseCommands = () => {
  const { t } = useTranslation()

  const enableReadwise = useIntegrationSettingKey("enableReadwise")
  const readwiseToken = useIntegrationSettingKey("readwiseToken")

  const isReadwiseAvailable = enableReadwise && !!readwiseToken

  useRegisterCommandEffect(
    !isReadwiseAvailable
      ? []
      : defineFollowCommand({
          id: COMMAND_ID.integration.saveToReadwise,
          label: t("entry_actions.save_to_readwise"),
          icon: <SimpleIconsReadwise />,
          run: async ({ entryId }) => {
            const entry = useEntryStore.getState().flatMapEntries[entryId]
            if (!entry) {
              toast.error("Failed to save to Readwise: entry is not available", { duration: 3000 })
              return
            }
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
                  url: entry.entries.url,
                  html: entry.entries.content || undefined,
                  title: entry.entries.title || undefined,
                  author: entry.entries.author || undefined,
                  summary: entry.entries.description || undefined,
                  published_date: entry.entries.publishedAt || undefined,
                  image_url: entry.entries.media?.[0]?.url || undefined,
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
        }),
  )
}

const useRegisterInstapaperCommands = () => {
  const { t } = useTranslation()

  const enableInstapaper = useIntegrationSettingKey("enableInstapaper")
  const instapaperUsername = useIntegrationSettingKey("instapaperUsername")
  const instapaperPassword = useIntegrationSettingKey("instapaperPassword")

  const isInstapaperAvailable = enableInstapaper && !!instapaperPassword && !!instapaperUsername

  useRegisterCommandEffect(
    !isInstapaperAvailable
      ? []
      : defineFollowCommand({
          id: COMMAND_ID.integration.saveToInstapaper,
          label: t("entry_actions.save_to_instapaper"),
          icon: <SimpleIconsInstapaper />,
          run: async ({ entryId }) => {
            const entry = useEntryStore.getState().flatMapEntries[entryId]
            if (!entry) {
              toast.error("Failed to save to Instapaper: entry is not available", {
                duration: 3000,
              })
              return
            }

            try {
              window.analytics?.capture("integration", {
                type: "instapaper",
                event: "save",
              })
              const data = await ofetch("https://www.instapaper.com/api/add", {
                query: {
                  url: entry.entries.url,
                  title: entry.entries.title,
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
        }),
  )
}

const useRegisterOmnivoreCommands = () => {
  const { t } = useTranslation()

  const enableOmnivore = useIntegrationSettingKey("enableOmnivore")
  const omnivoreToken = useIntegrationSettingKey("omnivoreToken")
  const omnivoreEndpoint = useIntegrationSettingKey("omnivoreEndpoint")

  const isOmnivoreAvailable = enableOmnivore && !!omnivoreToken && !!omnivoreEndpoint

  useRegisterCommandEffect(
    !isOmnivoreAvailable
      ? []
      : defineFollowCommand({
          id: COMMAND_ID.integration.saveToOmnivore,
          label: t("entry_actions.save_to_omnivore"),
          icon: <SimpleIconsOmnivore />,
          run: async ({ entryId }) => {
            const entry = useEntryStore.getState().flatMapEntries[entryId]
            if (!entry) {
              toast.error("Failed to save to Omnivore: entry is not available", { duration: 3000 })
              return
            }
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
                      url: entry.entries.url,
                      source: "Follow",
                      clientRequestId: globalThis.crypto.randomUUID(),
                      publishedAt: new Date(entry.entries.publishedAt),
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
        }),
  )
}

const getEntryContentAsMarkdown = async (entry: FlatEntryModel) => {
  const isReadabilityReady = getReadabilityStatus()[entry.entries.id] === ReadabilityStatus.SUCCESS
  const content =
    (isReadabilityReady
      ? getReadabilityContent()[entry.entries.id].content
      : entry.entries.content) || ""
  const [toMarkdown, toMdast, gfmTableToMarkdown] = await Promise.all([
    import("mdast-util-to-markdown").then((m) => m.toMarkdown),
    import("hast-util-to-mdast").then((m) => m.toMdast),
    import("mdast-util-gfm-table").then((m) => m.gfmTableToMarkdown),
  ])
  return toMarkdown(toMdast(parseHtml(content).hastTree), {
    extensions: [gfmTableToMarkdown()],
  })
}

const useRegisterObsidianCommands = () => {
  const { t } = useTranslation()

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
      : defineFollowCommand({
          id: COMMAND_ID.integration.saveToObsidian,
          label: t("entry_actions.save_to_obsidian"),
          icon: <SimpleIconsObsidian />,
          run: async ({ entryId }) => {
            const entry = useEntryStore.getState().flatMapEntries[entryId]
            if (!entry) {
              toast.error("Failed to save to Obsidian: entry is not available", { duration: 3000 })
              return
            }
            const markdownContent = await getEntryContentAsMarkdown(entry)
            window.analytics?.capture("integration", {
              type: "obsidian",
              event: "save",
            })
            saveToObsidian.mutate({
              url: entry.entries.url || "",
              title: entry.entries.title || "",
              content: markdownContent,
              author: entry.entries.author || "",
              publishedAt: entry.entries.publishedAt || "",
              vaultPath: obsidianVaultPath,
            })
          },
        }),
  )
}

const useRegisterOutlineCommands = () => {
  const { t } = useTranslation()

  const enableOutline = useIntegrationSettingKey("enableOutline")
  const outlineEndpoint = useIntegrationSettingKey("outlineEndpoint")
  const outlineToken = useIntegrationSettingKey("outlineToken")
  const outlineCollection = useIntegrationSettingKey("outlineCollection")
  const outlineAvailable =
    enableOutline && !!outlineToken && !!outlineEndpoint && !!outlineCollection

  useRegisterCommandEffect(
    !IN_ELECTRON || !outlineAvailable
      ? []
      : defineFollowCommand({
          id: COMMAND_ID.integration.saveToOutline,
          label: t("entry_actions.save_to_outline"),
          icon: <SimpleIconsOutline />,
          run: async ({ entryId }) => {
            const entry = useEntryStore.getState().flatMapEntries[entryId]
            if (!entry) {
              toast.error("Failed to save to Outline: entry is not available", { duration: 3000 })
              return
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
              const markdownContent = await getEntryContentAsMarkdown(entry)
              await request("documents.create", {
                title: entry.entries.title,
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
        }),
  )
}
