import { IN_ELECTRON } from "@follow/shared/constants"
import { Slot } from "@radix-ui/react-slot"
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
import { ActionButton } from "~/components/ui/button"
import { DividerVertical } from "~/components/ui/divider"
import { views } from "~/constants"
import { shortcuts } from "~/constants/shortcuts"
import { useEntryActions, useEntryReadabilityToggle } from "~/hooks/biz/useEntryActions"
import { tipcClient } from "~/lib/client"
import { FeedViewType } from "~/lib/enum"
import { parseHtml } from "~/lib/parse-html"
import { cn } from "~/lib/utils"
import type { CombinedEntryModel } from "~/models"
import type { FlatEntryModel } from "~/store/entry"
import { useEntry } from "~/store/entry/hooks"
import { useFeedById } from "~/store/feed"

import { useEntryContentScrollToTop, useEntryTitleMeta } from "./atoms"
import { EntryReadHistory } from "./components/EntryReadHistory"

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

  const { items } = useEntryActions({
    view,
    entry,
    type: "toolbar",
  })

  const entryTitleMeta = useEntryTitleMeta()
  const isAtTop = useEntryContentScrollToTop()

  const shouldShowMeta = !isAtTop && !!entryTitleMeta?.title

  if (!entry?.entries) return null

  return (
    <div
      className={cn(
        "relative flex min-w-0 items-center justify-between gap-3 overflow-hidden text-lg text-zinc-500",
        shouldShowMeta && "border-b border-border",
        className,
      )}
    >
      <div
        className={cn(
          "absolute left-5 top-0 flex h-full items-center gap-2 text-[13px] leading-none text-zinc-500",
          isAtTop ? "visible z-[11]" : "invisible z-[-99]",
          views[view].wideMode && "static",
          shouldShowMeta && "hidden",
        )}
      >
        <EntryReadHistory entryId={entryId} />
      </div>
      <div className="relative z-10 flex w-full items-center justify-between gap-3">
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

          {items
            .filter((item) => !item.hide)
            .map((item) => (
              <ActionButton
                disabled={item.disabled}
                icon={
                  item.icon ? (
                    <Slot className="size-4">{item.icon}</Slot>
                  ) : (
                    <i className={item.className} />
                  )
                }
                active={item.active}
                shortcut={item.shortcut}
                onClick={item.onClick}
                tooltip={item.name}
                key={item.name}
              />
            ))}
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
