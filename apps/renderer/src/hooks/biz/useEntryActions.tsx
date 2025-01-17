import { isMobile } from "@follow/components/hooks/useMobile.js"
import { FeedViewType, UserRole } from "@follow/constants"
import { IN_ELECTRON } from "@follow/shared/constants"
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
import { useUserRole, whoami } from "~/atoms/user"
import { shortcuts } from "~/constants/shortcuts"
import { tipcClient } from "~/lib/client"
import { COMMAND_ID } from "~/modules/command/commands/id"
import { useRunCommandFn } from "~/modules/command/hooks/use-command"
import type { FollowCommandId } from "~/modules/command/types"
import { useToolbarOrderMap } from "~/modules/customize-toolbar/hooks"
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
  onClick: () => void
  hide?: boolean
  shortcut?: string
  active?: boolean
  disabled?: boolean
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

  const runCmdFn = useRunCommandFn()
  const hasEntry = !!entry

  const userRole = useUserRole()

  const actionConfigs: EntryActionItem[] = useMemo(() => {
    if (!hasEntry) return []
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
        id: COMMAND_ID.integration.saveToObsidian,
        onClick: runCmdFn(COMMAND_ID.integration.saveToObsidian, [{ entryId }]),
      },
      {
        id: COMMAND_ID.integration.saveToOutline,
        onClick: runCmdFn(COMMAND_ID.integration.saveToOutline, [{ entryId }]),
      },
      {
        id: COMMAND_ID.integration.saveToReadeck,
        onClick: runCmdFn(COMMAND_ID.integration.saveToReadeck, [{ entryId }]),
      },
      {
        id: COMMAND_ID.entry.tip,
        onClick: runCmdFn(COMMAND_ID.entry.tip, [
          { entryId, feedId: feed?.id, userId: feed?.ownerUserId },
        ]),
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
        disabled: userRole === UserRole.Trial,
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
        disabled: userRole === UserRole.Trial,
      },
      {
        id: COMMAND_ID.entry.share,
        onClick: runCmdFn(COMMAND_ID.entry.share, [{ entryId }]),
        hide: !entry?.entries.url || !("share" in navigator || IN_ELECTRON),
        shortcut: shortcuts.entry.share.key,
      },
      {
        id: COMMAND_ID.entry.read,
        onClick: runCmdFn(COMMAND_ID.entry.read, [{ entryId }]),
        hide: !hasEntry || entry.read || !!entry.collections || !!inList,
        shortcut: shortcuts.entry.toggleRead.key,
      },
      {
        id: COMMAND_ID.entry.unread,
        onClick: runCmdFn(COMMAND_ID.entry.unread, [{ entryId }]),
        hide: !hasEntry || !entry.read || !!entry.collections || !!inList,
        shortcut: shortcuts.entry.toggleRead.key,
      },
      {
        id: COMMAND_ID.settings.customizeToolbar,
        onClick: runCmdFn(COMMAND_ID.settings.customizeToolbar, []),
      },
    ].filter((config) => !config.hide)
  }, [
    entry?.collections,
    entry?.entries.url,
    entry?.read,
    entry?.settings?.summary,
    entry?.settings?.translation,
    entry?.view,
    entryId,
    feed?.id,
    feed?.ownerUserId,
    hasEntry,
    inList,
    isInbox,
    isShowAISummary,
    isShowAITranslation,
    isShowSourceContent,
    runCmdFn,
    userRole,
    view,
  ])

  return actionConfigs
}

export const useSortedEntryActions = ({
  entryId,
  view,
}: {
  entryId: string
  view?: FeedViewType
}) => {
  const entryActions = useEntryActions({ entryId, view })
  const orderMap = useToolbarOrderMap()
  const mainAction = useMemo(
    () =>
      entryActions
        .filter((item) => {
          const order = orderMap.get(item.id)
          if (!order) return false
          return order.type === "main"
        })
        .sort((a, b) => {
          const orderA = orderMap.get(a.id)?.order || 0
          const orderB = orderMap.get(b.id)?.order || 0
          return orderA - orderB
        }),
    [entryActions, orderMap],
  )

  const moreAction = useMemo(
    () =>
      entryActions
        .filter((item) => {
          const order = orderMap.get(item.id)
          // If the order is not set, it should be in the "more" menu
          if (!order) return true
          return order.type !== "main"
        })
        // .filter((item) => item.id !== COMMAND_ID.settings.customizeToolbar)
        .sort((a, b) => {
          const orderA = orderMap.get(a.id)?.order || Infinity
          const orderB = orderMap.get(b.id)?.order || Infinity
          return orderA - orderB
        }),
    [entryActions, orderMap],
  )

  return {
    mainAction,
    moreAction,
  }
}
