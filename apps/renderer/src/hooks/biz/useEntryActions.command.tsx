import {
  SimpleIconsEagle,
  SimpleIconsInstapaper,
  SimpleIconsObsidian,
  SimpleIconsOmnivore,
  SimpleIconsOutline,
  SimpleIconsReadwise,
} from "@follow/components/ui/platform-icon/icons.js"
import { FeedViewType } from "@follow/constants"
import type { CombinedEntryModel } from "@follow/models/types"
import { useQuery } from "@tanstack/react-query"
import type { FetchError } from "ofetch"
import { ofetch } from "ofetch"
import type { ReactNode } from "react"
import { useCallback, useMemo } from "react"

import {
  getReadabilityStatus,
  ReadabilityStatus,
  setReadabilityContent,
  setReadabilityStatus,
} from "~/atoms/readability"
import { useIntegrationSettingValue } from "~/atoms/settings/integration"
import {
  setShowSourceContent,
  toggleShowSourceContent,
  useShowSourceContent,
  useSourceContentModal,
} from "~/atoms/source-content"
import { whoami } from "~/atoms/user"
import { tipcClient } from "~/lib/client"
import { CommandRegistry } from "~/modules/command/registry/registry"
import type { FlatEntryModel } from "~/store/entry"
import { getFeedById, useFeedById } from "~/store/feed"
import { useInboxById } from "~/store/inbox"

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
  const feed = useFeedById(entry?.feedId, (feed) => {
    return {
      type: feed.type,
      ownerUserId: feed.ownerUserId,
      id: feed.id,
    }
  })

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

  const showSourceContent = useShowSourceContent()

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
      { id: "integration:save-to-eagle", hide: !isEagleAvailable },
      { id: "integration:save-to-readwise", hide: !enableReadwise && !readwiseToken },
      {
        id: "integration:save-to-instapaper",
        hide: !enableInstapaper || !instapaperUsername || !instapaperPassword,
      },
      {
        id: "integration:save-to-omnivore",
        hide: !enableOmnivore || !omnivoreToken || !omnivoreEndpoint,
      },
      { id: "integration:save-to-obsidian", hide: !isObsidianEnabled || !obsidianVaultPath },

      { id: "entry:tip", hide: isInbox || feed?.ownerUserId === whoami()?.id },
      { id: "entry:star", hide: !!populatedEntry.collections },
      { id: "entry:unstar", hide: !populatedEntry.collections },
      { id: "entry:delete", hide: !isInbox },
      { id: "entry:copy-link", hide: !populatedEntry.entries.url },
      { id: "entry:copy-title", hide: !populatedEntry.entries.title || type === "toolbar" },
      { id: "entry:open-in-browser", hide: type === "toolbar" || !populatedEntry.entries.url },
      { id: "entry:view-source-content", hide: showSourceContent },
      { id: "entry:view-entry-content", hide: !showSourceContent, active: true },
      { id: "entry:share", hide: !(populatedEntry.entries.url && navigator.share) },
      { id: "entry:read", hide: !!(!!populatedEntry.read || populatedEntry.collections || inList) },
      {
        id: "entry:unread",
        hide: !!(!populatedEntry.read || populatedEntry.collections || inList),
      },
    ]
      .map((action) => {
        if (!CommandRegistry.has(action.id)) return null
        const cmd = CommandRegistry.get(action.id)
        if (!cmd) return null
        return {
          ...action,
          key: action.id,
          name: cmd.label.title,
          icon: cmd.icon,
          shortcut: cmd.keyBinding?.binding,
          onClick: () => CommandRegistry.run(action.id),
        }
      })
      .filter((i) => i !== null)

    return items
  }, [
    populatedEntry,
    view,
    isEagleAvailable,
    enableReadwise,
    readwiseToken,
    enableInstapaper,
    instapaperUsername,
    instapaperPassword,
    enableOmnivore,
    omnivoreToken,
    omnivoreEndpoint,
    isObsidianEnabled,
    obsidianVaultPath,
    isInbox,
    feed?.ownerUserId,
    type,
    showSourceContent,
    inList,
  ])

  return {
    items,
  }
}
