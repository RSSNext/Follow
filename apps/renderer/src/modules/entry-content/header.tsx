import { ActionButton } from "@follow/components/ui/button/index.js"
import { DividerVertical } from "@follow/components/ui/divider/index.js"
import { FeedViewType, views } from "@follow/constants"
import type { CombinedEntryModel, MediaModel } from "@follow/models/types"
import { IN_ELECTRON } from "@follow/shared/constants"
import { cn } from "@follow/utils/utils"
import { noop } from "foxact/noop"
import { AnimatePresence, m } from "framer-motion"
import { memo, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

import { AudioPlayer, getAudioPlayerAtomValue } from "~/atoms/player"
import {
  isInReadability,
  ReadabilityStatus,
  useEntryInReadabilityStatus,
} from "~/atoms/readability"
import { useUISettingKey } from "~/atoms/settings/ui"
import { useShowSourceContent } from "~/atoms/source-content"
import { whoami } from "~/atoms/user"
import { useModalStack } from "~/components/ui/modal/stacked/hooks"
import { shortcuts } from "~/constants/shortcuts"
import { useEntryReadabilityToggle } from "~/hooks/biz/useEntryActions"
import { useRouteParamsSelector } from "~/hooks/biz/useRouteParams"
import { tipcClient } from "~/lib/client"
import { parseHtml } from "~/lib/parse-html"
import { filterSmallMedia } from "~/lib/utils"
import type { FlatEntryModel } from "~/store/entry"
import { useEntry } from "~/store/entry/hooks"
import { useFeedById } from "~/store/feed"
import { useInboxById } from "~/store/inbox/hooks"

import { CommandIdButton } from "../command/command-button"
import { COMMAND_ID } from "../command/commands/id"
import { useCommandHotkey } from "../command/hooks/use-register-hotkey"
import { defineCommandArgsArray } from "../command/registry/command"
import { ImageGallery } from "./actions/picture-gallery"
import { useEntryContentScrollToTop, useEntryTitleMeta } from "./atoms"
import { EntryReadHistory } from "./components/EntryReadHistory"

const EntryHeaderActions = ({ entryId }: { entryId: string }) => {
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

  useCommandHotkey({
    shortcut: shortcuts.entry.openInBrowser.key,
    when: !!entry?.entries.url,
    commandId: COMMAND_ID.entry.openInBrowser,
    args: [{ entryId }],
  })

  const buttonsConfig = defineCommandArgsArray<{
    when?: boolean
    shortcut?: string
    active?: boolean
  }>([
    { commandId: COMMAND_ID.integration.saveToEagle, args: [{ entryId }] },
    { commandId: COMMAND_ID.integration.saveToReadwise, args: [{ entryId }] },
    { commandId: COMMAND_ID.integration.saveToInstapaper, args: [{ entryId }] },
    { commandId: COMMAND_ID.integration.saveToOmnivore, args: [{ entryId }] },
    { commandId: COMMAND_ID.integration.saveToObsidian, args: [{ entryId }] },
    { commandId: COMMAND_ID.integration.saveToOutline, args: [{ entryId }] },
    {
      when: !isInbox && feed?.ownerUserId !== whoami()?.id,
      commandId: COMMAND_ID.entry.tip,
      args: [{ entryId, feedId: feed?.id }],
      shortcut: shortcuts.entry.tip.key,
    },
    {
      when: !!entry?.collections,
      commandId: COMMAND_ID.entry.unstar,
      args: [{ entryId }],
      shortcut: shortcuts.entry.toggleStarred.key,
    },
    {
      when: !entry?.collections,
      commandId: COMMAND_ID.entry.star,
      args: [{ entryId }],
      shortcut: shortcuts.entry.toggleStarred.key,
    },
    {
      when: isInbox,
      commandId: COMMAND_ID.entry.delete,
      args: [{ entryId }],
      shortcut: shortcuts.entry.copyLink.key,
    },
    {
      when: !!entry?.entries.url,
      commandId: COMMAND_ID.entry.copyLink,
      args: [{ entryId }],
      shortcut: shortcuts.entry.copyTitle.key,
    },
    {
      when: !isShowSourceContent && !!entry?.entries.url,
      commandId: COMMAND_ID.entry.viewSourceContent,
      args: [{ entryId }],
    },
    {
      when: isShowSourceContent,
      commandId: COMMAND_ID.entry.viewEntryContent,
      args: [],
      active: true,
    },
    {
      when: !!entry?.entries.url && "share" in navigator,
      commandId: COMMAND_ID.entry.share,
      args: [{ entryId }],
      shortcut: shortcuts.entry.share.key,
    },
    {
      when: !!entry && !entry.read && !entry.collections && !inList,
      commandId: COMMAND_ID.entry.read,
      args: [{ entryId }],
      shortcut: shortcuts.entry.toggleRead.key,
    },
    {
      when: !!entry && !!entry.read && !entry.collections && !inList,
      commandId: COMMAND_ID.entry.unread,
      args: [{ entryId }],
      shortcut: shortcuts.entry.toggleRead.key,
    },
  ])

  return buttonsConfig
    .filter((config) => ("when" in config ? config.when : true))
    .map((config) => {
      return (
        <CommandIdButton
          key={config.commandId}
          commandId={config.commandId}
          args={config.args}
          shortcut={config.shortcut}
          active={config.active}
        />
      )
    })
}

function EntryHeaderImpl({
  view,
  entryId,
  className,
  compact,
}: {
  view: number
  entryId: string
  className?: string
  compact?: boolean
}) {
  const entry = useEntry(entryId)
  const entryTitleMeta = useEntryTitleMeta()
  const isAtTop = useEntryContentScrollToTop()

  const hideRecentReader = useUISettingKey("hideRecentReader")

  const shouldShowMeta = (hideRecentReader || !isAtTop) && !!entryTitleMeta?.title

  if (!entry?.entries) return null

  return (
    <div
      data-hide-in-print
      className={cn(
        "relative flex min-w-0 items-center justify-between gap-3 overflow-hidden text-lg text-zinc-500 duration-200 zen-mode-macos:ml-margin-macos-traffic-light-x",
        shouldShowMeta && "border-b border-border",
        className,
      )}
    >
      {!hideRecentReader && (
        <div
          className={cn(
            "absolute left-5 top-0 flex h-full items-center gap-2 text-[13px] leading-none text-zinc-500 zen-mode-macos:left-12",
            "visible z-[11]",
            views[view].wideMode && "static",
            shouldShowMeta && "hidden",
          )}
        >
          <EntryReadHistory entryId={entryId} />
        </div>
      )}
      <div
        className="relative z-10 flex w-full items-center justify-between gap-3"
        data-hide-in-print
      >
        <div className="flex min-w-0 shrink grow">
          <AnimatePresence>
            {shouldShowMeta && (
              <m.div
                initial={{ opacity: 0.01, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0.01, y: 30 }}
                className="flex min-w-0 shrink items-end gap-2 truncate text-sm leading-tight text-theme-foreground"
              >
                <span className="min-w-0 shrink truncate font-bold">{entryTitleMeta.title}</span>
                <i className="i-mgc-line-cute-re size-[10px] shrink-0 translate-y-[-3px] rotate-[-25deg]" />
                <span className="shrink-0 truncate text-xs opacity-80">
                  {entryTitleMeta.description}
                </span>
              </m.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative flex shrink-0 items-center justify-end gap-3">
          {!compact && <ElectronAdditionActions view={view} entry={entry} key={entry.entries.id} />}

          <SpecialActions id={entry.entries.id} />
          <EntryHeaderActions entryId={entry.entries.id} />
        </div>
      </div>
    </div>
  )
}

const ElectronAdditionActions = IN_ELECTRON
  ? ({
      view = FeedViewType.Articles,
      entry,
    }: {
      view: FeedViewType
      entry?: FlatEntryModel | null
    }) => {
      const entryReadabilityStatus = useEntryInReadabilityStatus(entry?.entries.id)

      const { t } = useTranslation()

      const feed = useFeedById(entry?.feedId)

      const populatedEntry = useMemo(() => {
        if (!entry) return null
        if (!feed) return null
        return {
          ...entry,
          feeds: feed!,
        } as CombinedEntryModel
      }, [entry, feed])

      const readabilityToggle = useEntryReadabilityToggle({
        id: populatedEntry?.entries.id ?? "",
        url: populatedEntry?.entries.url ?? "",
      })

      const [ttsLoading, setTtsLoading] = useState(false)

      if (!populatedEntry) return null

      const items = [
        {
          key: "tts",
          name: t("entry_content.header.play_tts"),
          shortcut: shortcuts.entry.tts.key,
          className: ttsLoading ? "i-mgc-loading-3-cute-re animate-spin" : "i-mgc-voice-cute-re",

          disabled: !populatedEntry.entries.content,
          onClick: async () => {
            if (ttsLoading) return
            if (!populatedEntry.entries.content) return
            setTtsLoading(true)
            if (getAudioPlayerAtomValue().entryId === populatedEntry.entries.id) {
              AudioPlayer.togglePlayAndPause()
            } else {
              const filePath = await tipcClient?.tts({
                id: populatedEntry.entries.id,
                text: (await parseHtml(populatedEntry.entries.content)).toText(),
              })
              if (filePath) {
                AudioPlayer.mount({
                  type: "audio",
                  entryId: populatedEntry.entries.id,
                  src: `file://${filePath}`,
                  currentTime: 0,
                })
              }
            }
            setTtsLoading(false)
          },
        },
        {
          name: t("entry_content.header.readability"),
          className: cn(
            isInReadability(entryReadabilityStatus)
              ? `i-mgc-docment-cute-fi`
              : `i-mgc-docment-cute-re`,
            entryReadabilityStatus === ReadabilityStatus.WAITING ? `animate-pulse` : "",
          ),
          key: "readability",
          hide: views[view].wideMode || !populatedEntry.entries.url,
          active: isInReadability(entryReadabilityStatus),
          onClick: readabilityToggle,
        },
      ]

      if (items.length === 0) return null
      return (
        <>
          {items
            .filter((item) => !item.hide)
            .map((item) => (
              <ActionButton
                disabled={item.disabled}
                icon={<i className={item.className} />}
                active={item.active}
                shortcut={item.shortcut}
                onClick={item.onClick}
                tooltip={item.name}
                key={item.name}
              />
            ))}
          <DividerVertical className="mx-2 w-px" />
        </>
      )
    }
  : noop

export const EntryHeader = memo(EntryHeaderImpl)

const SpecialActions = ({ id }: { id: string }) => {
  const images = useEntry(id, (entry) => entry.entries.media)
  const { present } = useModalStack()
  const filteredImages = filterSmallMedia(images)
  if (filteredImages?.length && filteredImages.length > 5) {
    return (
      <ActionButton
        onClick={() => {
          window.analytics?.capture("entry_content_header_image_gallery_click")
          present({
            title: "Image Gallery",
            content: () => <ImageGallery images={filteredImages as any as MediaModel[]} />,
            max: true,
          })
        }}
        icon={<i className="i-mgc-pic-cute-fi" />}
        tooltip={`Image Gallery`}
      />
    )
  }
  return null
}
