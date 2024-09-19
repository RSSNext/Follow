import type { FC, ReactNode } from "react"
import { memo } from "react"

import { LoadingCircle } from "~/components/ui/loading"
import { views } from "~/constants"
import { useAuthQuery } from "~/hooks/common"
import { FeedViewType } from "~/lib/enum"
import { cn } from "~/lib/utils"
import { Queries } from "~/queries"
import type { FlatEntryModel } from "~/store/entry"
import { useEntry } from "~/store/entry/hooks"

import { ReactVirtuosoItemPlaceholder } from "../../components/ui/placeholder"
import { ArticleItem, ArticleItemSkeleton } from "./Items/article-item"
import { AudioItem, AudioItemSkeleton } from "./Items/audio-item"
import { NotificationItem, NotificationItemSkeleton } from "./Items/notification-item"
import { PictureItem, PictureItemSkeleton } from "./Items/picture-item"
import { SocialMediaItem, SocialMediaItemSkeleton } from "./Items/social-media-item"
import { VideoItem, VideoItemSkeleton } from "./Items/video-item"
import { EntryItemWrapper } from "./layouts/EntryItemWrapper"
import { girdClassNames } from "./styles"
import type { EntryListItemFC } from "./types"

interface EntryItemProps {
  entryId: string
  view?: number
}
function EntryItemImpl({ entry, view }: { entry: FlatEntryModel; view?: number }) {
  const translation = useAuthQuery(
    Queries.ai.translation({
      entry,
      view,
      language: entry.settings?.translation,
    }),
    {
      enabled: !!entry.settings?.translation,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      meta: {
        persist: true,
      },
    },
  )

  let Item: EntryListItemFC

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
    <EntryItemWrapper itemClassName={Item.wrapperClassName} entry={entry} view={view} overlay>
      <Item entryId={entry.entries.id} translation={translation.data} />
    </EntryItemWrapper>
  )
}

export const EntryItem: FC<EntryItemProps> = memo(({ entryId, view }) => {
  const entry = useEntry(entryId)
  if (!entry) return <ReactVirtuosoItemPlaceholder />
  return <EntryItemImpl entry={entry} view={view} />
})

const SkeletonItemMap = {
  [FeedViewType.Articles]: ArticleItemSkeleton,
  [FeedViewType.SocialMedia]: SocialMediaItemSkeleton,
  [FeedViewType.Pictures]: PictureItemSkeleton,
  [FeedViewType.Videos]: VideoItemSkeleton,
  [FeedViewType.Audios]: AudioItemSkeleton,
  [FeedViewType.Notifications]: NotificationItemSkeleton,
}

const LoadingCircleFallback = (
  <div className="center mt-2">
    <LoadingCircle size="medium" />
  </div>
)

export const EntryItemSkeleton: FC<{
  view: FeedViewType
  count?: number
}> = memo(({ view, count }) => {
  const SkeletonItem = SkeletonItemMap[view]
  if (count === 1) {
    return SkeletonItem
  }

  return SkeletonItem ? (
    <div className={cn(views[view].gridMode ? girdClassNames : "flex flex-col")}>
      {createSkeletonItems(SkeletonItem, count || 10)}
    </div>
  ) : (
    LoadingCircleFallback
  )
})

const createSkeletonItems = (element: ReactNode, count: number) => {
  const children = [] as ReactNode[]
  for (let i = 0; i < count; i++) {
    children.push(element)
  }
  return children
}
