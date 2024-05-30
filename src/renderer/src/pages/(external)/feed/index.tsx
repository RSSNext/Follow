import { ArticleItem } from "@renderer/components/entry-column/article-item"
import { NotificationItem } from "@renderer/components/entry-column/notification-item"
import { PictureItem } from "@renderer/components/entry-column/picture-item"
import { SocialMediaItem } from "@renderer/components/entry-column/social-media-item"
import type { UniversalItemProps } from "@renderer/components/entry-column/types"
import { VideoItem } from "@renderer/components/entry-column/video-item"
import { FeedIcon } from "@renderer/components/feed-icon"
import { levels } from "@renderer/lib/constants"
import { useEntries } from "@renderer/queries/entries"
import { useFeed } from "@renderer/queries/feed"
import type { FC } from "react"
import { useParams } from "react-router-dom"

export function Component() {
  const { id } = useParams()
  const view = Number.parseInt(new URLSearchParams(location.search).get("view") || "0")

  const feed = useFeed({
    id,
  })
  const entries = useEntries({
    id,
    level: levels.feed,
  })

  let Item: FC<UniversalItemProps>
  switch (view) {
    case 0: {
      Item = ArticleItem
      break
    }
    case 1: {
      Item = SocialMediaItem
      break
    }
    case 2: {
      Item = PictureItem
      break
    }
    case 3: {
      Item = VideoItem
      break
    }
    case 5: {
      Item = NotificationItem
      break
    }
    default: {
      Item = ArticleItem
    }
  }

  return (
    <>
      {feed.data?.feed && (
        <div className="mx-auto flex max-w-5xl flex-col items-center">
          <div className="mb-2 mt-10 flex items-center text-2xl font-bold">
            <FeedIcon
              feed={feed.data.feed}
              className="size-8 shrink-0"
            />
            <h1>{feed.data.feed.title}</h1>
          </div>
          <div className="mb-10 text-sm text-zinc-500">{feed.data.feed.description}</div>
          <div className="w-full">
            {entries.data?.pages.map((page) =>
              page.data?.map((entry) => (
                <a href={entry.entries.url || void 0} target="_blank" key={entry.entries.id}>
                  <Item entryId={entry.entries.id} />
                </a>
              )),
            )}
          </div>
        </div>
      )}
    </>
  )
}
