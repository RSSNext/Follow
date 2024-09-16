import { FeedIcon } from "@renderer/components/feed-icon"
import { FollowIcon } from "@renderer/components/icons/follow"
import { Button } from "@renderer/components/ui/button"
import { ListItemHoverOverlay } from "@renderer/components/ui/list-item-hover-overlay"
import { LoadingCircle } from "@renderer/components/ui/loading"
import { views } from "@renderer/constants"
import { usePresentFeedFormModal } from "@renderer/hooks/biz/useFeedFormModal"
import { useTitle } from "@renderer/hooks/common"
import { FeedViewType } from "@renderer/lib/enum"
import { cn } from "@renderer/lib/utils"
import { ArticleItem } from "@renderer/modules/entry-column/Items/article-item"
import { NotificationItem } from "@renderer/modules/entry-column/Items/notification-item"
import { PictureItem } from "@renderer/modules/entry-column/Items/picture-item"
import { SocialMediaItem } from "@renderer/modules/entry-column/Items/social-media-item"
import { VideoItem } from "@renderer/modules/entry-column/Items/video-item"
import type { UniversalItemProps } from "@renderer/modules/entry-column/types"
import { useEntriesPreview } from "@renderer/queries/entries"
import { useFeed } from "@renderer/queries/feed"
import type { FC } from "react"
import { useTranslation } from "react-i18next"
import { useParams, useSearchParams } from "react-router-dom"
import { toast } from "sonner"

export function Component() {
  const { id } = useParams()
  const [search] = useSearchParams()
  const view = Number.parseInt(search.get("view") || "0")

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
  const { t } = useTranslation("external")
  useTitle(feed.data?.feed.title)
  const presentFeedFormModal = usePresentFeedFormModal()
  return (
    <>
      {feed.isLoading ? (
        <LoadingCircle size="large" className="center h-48 w-full max-w-full" />
      ) : (
        feed.data?.feed && (
          <div className="mx-auto mt-12 flex max-w-5xl flex-col items-center justify-center p-4 lg:p-0">
            <FeedIcon
              fallback
              feed={feed.data.feed}
              className="mask-squircle mask shrink-0"
              size={64}
            />
            <div className="flex flex-col items-center">
              <div className="mb-2 mt-4 flex items-center text-2xl font-bold">
                <h1>{feed.data.feed.title}</h1>
              </div>
              <div className="mb-8 text-sm text-zinc-500">{feed.data.feed.description}</div>
            </div>
            <div className="mb-4 text-sm">
              {t("feed.followsAndReads", {
                subscriptionCount: feed.data.subscriptionCount,
                subscriptionNoun: t("feed.follower", { count: feed.data.subscriptionCount }),
                readCount: feed.data.readCount,
                readNoun: t("feed.read", { count: feed.data.readCount }),
                appName: APP_NAME,
              })}
            </div>
            <span className="center mb-8 flex gap-4">
              {feed.data.feed.url.startsWith("https://") ? (
                <Button
                  variant={"outline"}
                  onClick={() => {
                    window.open(feed.data.feed.url, "_blank")
                  }}
                >
                  View Feed URL
                </Button>
              ) : (
                <Button
                  variant={"outline"}
                  onClick={() => {
                    toast.success(t("copied_link"))
                    navigator.clipboard.writeText(feed.data.feed.url)
                  }}
                >
                  Copy Feed URL
                </Button>
              )}
              <Button
                onClick={() => {
                  presentFeedFormModal(id!)
                }}
              >
                <FollowIcon className="mr-1 size-3" />
                {APP_NAME}
              </Button>
            </span>
            <div
              className={cn(
                "w-full pb-12",
                views[view].gridMode
                  ? "grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4"
                  : "flex max-w-3xl flex-col gap-6",
              )}
            >
              {entries.data?.map((entry) => (
                <a
                  className="relative cursor-pointer"
                  href={entry.url || void 0}
                  target="_blank"
                  key={entry.id}
                >
                  <ListItemHoverOverlay className="rounded">
                    <Item
                      entryPreview={{
                        entries: entry,
                        // @ts-expect-error
                        feeds: feed.data.feed as FeedModel,
                        read: true,
                        feedId: feed.data.feed.id!,
                      }}
                      entryId={entry.id}
                    />
                  </ListItemHoverOverlay>
                </a>
              ))}
            </div>
          </div>
        )
      )}
    </>
  )
}
