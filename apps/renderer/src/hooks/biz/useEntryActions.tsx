import { isMobile } from "@follow/components/hooks/useMobile.js"
import { FeedViewType } from "@follow/constants"
import type { ReactNode } from "react"
import { useCallback, useMemo } from "react"

import { useShowAISummary } from "~/atoms/ai-summary"
import { useShowAITranslation } from "~/atoms/ai-translation"
import {
  getReadabilityStatus,
  ReadabilityStatus,
  setReadabilityContent,
  setReadabilityStatus,
} from "~/atoms/readability"
import { useShowSourceContent } from "~/atoms/source-content"
import { whoami } from "~/atoms/user"
import { shortcuts } from "~/constants/shortcuts"
import { tipcClient } from "~/lib/client"
import { COMMAND_ID } from "~/modules/command/commands/id"
import { useGetCommand, useRunCommandFn } from "~/modules/command/hooks/use-command"
import type { FollowCommandId } from "~/modules/command/types"
import { useEntry } from "~/store/entry"
import { useFeedById } from "~/store/feed"
import { useInboxById } from "~/store/inbox"

import { useRouteParamsSelector } from "./useRouteParams"

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

export type EntryActionItem = {
  id: FollowCommandId
  name: string
  icon?: ReactNode
  active?: boolean
  shortcut?: string
  onClick: () => void
}

export const useEntryActions = ({ entryId, view }: { entryId: string; view?: FeedViewType }) => {
  const entry = useEntry(entryId)
  const feed = useFeedById(entry?.feedId, (feed) => {
    return {
      type: feed.type,
      ownerUserId: feed.ownerUserId,
      id: feed.id,
    }
  })
  const listId = useRouteParamsSelector((s) => s.listId)
  const inList = !!listId
  const inbox = useInboxById(entry?.inboxId)
  const isInbox = !!inbox

  const isShowSourceContent = useShowSourceContent()
  const isShowAISummary = useShowAISummary()
  const isShowAITranslation = useShowAITranslation()

  const getCmd = useGetCommand()
  const runCmdFn = useRunCommandFn()
  const actionConfigs = useMemo(() => {
    if (!entryId) return []
    return [
      {
        id: COMMAND_ID.integration.saveToEagle,
        onClick: runCmdFn(COMMAND_ID.integration.saveToEagle, [{ entryId }]),
      },
      {
        id: COMMAND_ID.integration.saveToReadwise,
        onClick: runCmdFn(COMMAND_ID.integration.saveToReadwise, [{ entryId }]),
      },
      {
        id: COMMAND_ID.integration.saveToInstapaper,
        onClick: runCmdFn(COMMAND_ID.integration.saveToInstapaper, [{ entryId }]),
      },
      {
        id: COMMAND_ID.integration.saveToOmnivore,
        onClick: runCmdFn(COMMAND_ID.integration.saveToOmnivore, [{ entryId }]),
      },
      {
        id: COMMAND_ID.integration.saveToObsidian,
        onClick: runCmdFn(COMMAND_ID.integration.saveToObsidian, [{ entryId }]),
      },
      {
        id: COMMAND_ID.integration.saveToOutline,
        onClick: runCmdFn(COMMAND_ID.integration.saveToOutline, [{ entryId }]),
      },
      {
        id: COMMAND_ID.entry.tip,
        onClick: runCmdFn(COMMAND_ID.entry.tip, [{ entryId, feedId: feed?.id }]),
        hide: isInbox || feed?.ownerUserId === whoami()?.id,
        shortcut: shortcuts.entry.tip.key,
      },
      {
        id: COMMAND_ID.entry.unstar,
        onClick: runCmdFn(COMMAND_ID.entry.unstar, [{ entryId }]),
        hide: !entry?.collections,
        shortcut: shortcuts.entry.toggleStarred.key,
      },
      {
        id: COMMAND_ID.entry.star,
        onClick: runCmdFn(COMMAND_ID.entry.star, [{ entryId, view }]),
        hide: !!entry?.collections,
        shortcut: shortcuts.entry.toggleStarred.key,
      },
      {
        id: COMMAND_ID.entry.delete,
        onClick: runCmdFn(COMMAND_ID.entry.delete, [{ entryId }]),
        hide: !isInbox,
        shortcut: shortcuts.entry.copyLink.key,
      },
      {
        id: COMMAND_ID.entry.copyLink,
        onClick: runCmdFn(COMMAND_ID.entry.copyLink, [{ entryId }]),
        hide: !entry?.entries.url,
        shortcut: shortcuts.entry.copyTitle.key,
      },
      {
        id: COMMAND_ID.entry.openInBrowser,
        onClick: runCmdFn(COMMAND_ID.entry.openInBrowser, [{ entryId }]),
      },
      {
        id: COMMAND_ID.entry.viewSourceContent,
        onClick: runCmdFn(COMMAND_ID.entry.viewSourceContent, [{ entryId }]),
        hide: isMobile() || isShowSourceContent || !entry?.entries.url,
      },
      {
        id: COMMAND_ID.entry.viewEntryContent,
        onClick: runCmdFn(COMMAND_ID.entry.viewEntryContent, []),
        hide: !isShowSourceContent,
        active: true,
      },
      {
        id: COMMAND_ID.entry.toggleAISummary,
        onClick: runCmdFn(COMMAND_ID.entry.toggleAISummary, []),
        hide:
          !!entry?.settings?.summary ||
          ([FeedViewType.SocialMedia, FeedViewType.Videos] as (number | undefined)[]).includes(
            entry?.view,
          ),
        active: isShowAISummary,
      },
      {
        id: COMMAND_ID.entry.toggleAITranslation,
        onClick: runCmdFn(COMMAND_ID.entry.toggleAITranslation, []),
        hide:
          !!entry?.settings?.translation ||
          ([FeedViewType.SocialMedia, FeedViewType.Videos] as (number | undefined)[]).includes(
            entry?.view,
          ),
        active: isShowAITranslation,
      },
      {
        id: COMMAND_ID.entry.share,
        onClick: runCmdFn(COMMAND_ID.entry.share, [{ entryId }]),
        hide: !entry?.entries.url || !("share" in navigator),
        shortcut: shortcuts.entry.share.key,
      },
      {
        id: COMMAND_ID.entry.read,
        onClick: runCmdFn(COMMAND_ID.entry.read, [{ entryId }]),
        hide: !entry || !!entry.read || !!entry.collections || !!inList,
        shortcut: shortcuts.entry.toggleRead.key,
      },
      {
        id: COMMAND_ID.entry.unread,
        onClick: runCmdFn(COMMAND_ID.entry.unread, [{ entryId }]),
        hide: !entry || !entry.read || !!entry.collections || !!inList,
        shortcut: shortcuts.entry.toggleRead.key,
      },
    ]
      .filter((config) => !config.hide)
      .map((config) => {
        const cmd = getCmd(config.id)
        if (!cmd) return null
        return {
          ...config,
          name: cmd.label.title,
          icon: cmd.icon,
        }
      })
      .filter((i) => i !== null)
  }, [
    entry,
    entryId,
    feed?.id,
    feed?.ownerUserId,
    getCmd,
    inList,
    isInbox,
    isShowAISummary,
    isShowAITranslation,
    isShowSourceContent,
    runCmdFn,
    view,
  ])

  return actionConfigs
}
