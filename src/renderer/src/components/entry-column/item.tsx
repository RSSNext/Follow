import { useAsRead } from "@renderer/hooks/useAsRead"
import { useBizQuery } from "@renderer/hooks/useBizQuery"
import { useEntryActions, useRead } from "@renderer/hooks/useEntryActions"
import { views } from "@renderer/lib/constants"
import { FeedViewType } from "@renderer/lib/enum"
import { showNativeMenu } from "@renderer/lib/native-menu"
import { cn } from "@renderer/lib/utils"
import type { SupportedLanguages } from "@renderer/models"
import { Queries } from "@renderer/queries"
import { feedActions, useFeedStore } from "@renderer/store"
import { useEntry } from "@renderer/store/entry/hooks"
import { franc } from "franc-min"
import type { FC } from "react"
import { memo } from "react"

import { ReactVirtuosoItemPlaceholder } from "../ui/placeholder"
import { ArticleItem } from "./article-item"
import { AudioItem } from "./audio-item"
import { NotificationItem } from "./notification-item"
import { PictureItem } from "./picture-item"
import { SocialMediaItem } from "./social-media-item"
import type { UniversalItemProps } from "./types"
import { VideoItem } from "./video-item"

const LanguageMap: Record<SupportedLanguages, {
  code: string
}> = {
  "en": {
    code: "eng",
  },
  "ja": {
    code: "jpn",
  },
  "zh-CN": {
    code: "cmn",
  },
  "zh-TW": {
    code: "cmn",
  },
}

function EntryItemImpl({
  entryId,
  view,
}: {
  entryId: string
  view?: number
}) {
  const entry = useEntry(entryId)
  const { items } = useEntryActions({
    view,
    entry,
  })

  let fields = (entry.settings?.translation && view !== undefined) ? (views[view!].translation).split(",") : []

  fields = fields.filter((field) => {
    if (entry.settings?.translation && entry.entries[field]) {
      const sourceLanguage = franc(entry.entries[field])

      if (sourceLanguage === LanguageMap[entry.settings?.translation].code) {
        return false
      } else {
        return true
      }
    } else {
      return false
    }
  })

  const translation = useBizQuery(Queries.ai.translation({
    id: entry.entries.id,
    language: entry.settings?.translation,
    fields: fields?.join(",") || "title",
  }), {
    enabled: !!entry.settings?.translation && !!fields?.length,
  })

  const activeEntry = useFeedStore((state) => state.activeEntry)

  const asRead = useAsRead(entry)

  const markReadMutation = useRead(entry)

  // NOTE: prevent 0 height element, react virtuoso will not stop render any more
  if (!entry) return <ReactVirtuosoItemPlaceholder />

  let Item: FC<UniversalItemProps>

  switch (view) {
    case FeedViewType.Articles: {
      Item = ArticleItem
      break
    }
    case FeedViewType.SocialMedia: {
      Item = SocialMediaItem
      break
    }
    case FeedViewType.Pictures: {
      Item = PictureItem
      break
    }
    case FeedViewType.Videos: {
      Item = VideoItem
      break
    }
    case FeedViewType.Audios: {
      Item = AudioItem
      break
    }
    case FeedViewType.Notifications: {
      Item = NotificationItem
      break
    }
    default: {
      Item = ArticleItem
    }
  }

  return (
    <div className={cn(!views[view || 0].wideMode && "pb-3")} data-entry-id={entryId}>
      <div
        className={cn(
          "rounded-md bg-background transition-colors",
          !views[view || 0].wideMode &&
          activeEntry === entry.entries.id &&
          "bg-theme-item-active",
          asRead ? "text-zinc-500/90" : "text-zinc-900 dark:text-white/90",
        )}
        // ref={ref}
        onClick={(e) => {
          e.stopPropagation()
          feedActions.setActiveEntry(entry.entries.id)
          if (!asRead) {
            markReadMutation.mutate()
          }
        }}
        onDoubleClick={() =>
          entry.entries.url && window.open(entry.entries.url, "_blank")}
        onContextMenu={(e) => {
          e.preventDefault()
          showNativeMenu(
            items
              .filter((item) => !item.disabled)
              .map((item) => ({
                type: "text",
                label: item.name,
                click: item.onClick,
              })),
            e,
          )
        }}
      >
        <Item entryId={entryId} translation={translation.data} />
      </div>
    </div>
  )
}

export const EntryItem = memo(EntryItemImpl)
