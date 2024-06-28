import { FeedIcon } from "@renderer/components/feed-icon"
import { FollowIcon } from "@renderer/components/icons/follow"
import { StyledButton } from "@renderer/components/ui/button"
import { ListItemHoverOverlay } from "@renderer/components/ui/list-item-hover-overlay"
import { APP_NAME, views } from "@renderer/lib/constants"
import { FeedViewType } from "@renderer/lib/enum"
import { cn } from "@renderer/lib/utils"
import type { FeedModel } from "@renderer/models"
import { ArticleItem } from "@renderer/modules/entry-column/article-item"
import { NotificationItem } from "@renderer/modules/entry-column/notification-item"
import { PictureItem } from "@renderer/modules/entry-column/picture-item"
import { SocialMediaItem } from "@renderer/modules/entry-column/social-media-item"
import type { UniversalItemProps } from "@renderer/modules/entry-column/types"
import { VideoItem } from "@renderer/modules/entry-column/video-item"
import { useEntriesPreview } from "@renderer/queries/entries"
import { useFeed } from "@renderer/queries/feed"
import { DEEPLINK_SCHEME } from "@shared/constants"
import type { FC } from "react"
import { Helmet } from "react-helmet-async"
import { useParams, useSearchParams } from "react-router-dom"

export function Component() {
  const { id } = useParams()
  const [search] = useSearchParams()
  const view = Number.parseInt(
    search.get("view") || "0",
  )

  const feed = useFeed({
    id,
  })
  const entries = useEntriesPreview({
    id,
  })

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
    case FeedViewType.Notifications: {
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
        <div className="mx-auto mt-12 flex max-w-5xl flex-col items-center justify-center p-4 lg:p-0">
          <Helmet>
            <title>
              {feed.data.feed.title}
              {" "}
              |
              {APP_NAME}
            </title>
          </Helmet>
          <FeedIcon
            feed={feed.data.feed}
            className="mask-squircle mask shrink-0"
            size={64}
          />
          <div className="flex flex-col items-center">
            <div className="mb-2 mt-4 flex items-center text-2xl font-bold">
              <h1>{feed.data.feed.title}</h1>
            </div>
            <div className="mb-8 text-sm text-zinc-500">
              {feed.data.feed.description}
            </div>
          </div>
          <div className="mb-4 text-sm">
            <strong>{feed.data.subscriptionCount}</strong>
            {" "}
            follows with
            {" "}
            <strong>{feed.data.readCount}</strong>
            {" "}
            reads on
            {APP_NAME}
          </div>
          <a className="mb-8" href={`${DEEPLINK_SCHEME}add?id=${id}`}>
            <StyledButton>
              <FollowIcon className="mr-1 size-3" />
              follow on
              {" "}
              {APP_NAME}
            </StyledButton>
          </a>
          <div
            className={cn(
              "w-full pb-12",
              views[view].gridMode ?
                "grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4" :
                "flex max-w-3xl flex-col gap-6",
            )}
          >
            {entries.data?.map((entry) => (
              <a
                className="relative cursor-pointer"
                href={entry.url || void 0}
                target="_blank"
                key={entry.id}
              >
                <ListItemHoverOverlay />
                <Item
                  entryId=""
                  entryPreview={{
                    entries: entry,
                    // @ts-expect-error
                    feeds: feed.data.feed as FeedModel,
                    read: false,
                  }}
                />
              </a>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
