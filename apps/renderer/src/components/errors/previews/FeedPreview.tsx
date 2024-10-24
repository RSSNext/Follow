import { LoadingCircle } from "@follow/components/ui/loading/index.jsx"
import type { FeedViewType } from "@follow/constants"
import { views } from "@follow/constants"
import type { FeedModel } from "@follow/models/types"
import { cn } from "@follow/utils/utils"
import type { FC } from "react"
import { useTranslation } from "react-i18next"
import { useSearchParams } from "react-router-dom"

import { getItemComponentByView } from "~/modules/entry-column/Items"
import type { UniversalItemProps } from "~/modules/entry-column/types"
import { FeedCertification } from "~/modules/feed/feed-certification"
import { FeedIcon } from "~/modules/feed/feed-icon"
import { useEntriesPreview } from "~/queries/entries"
import { useFeed } from "~/queries/feed"

export function FeedPreview(props: {
  feedId: string
  children: {
    actions: React.ReactNode
  }
}) {
  const { feedId: id, children } = props

  const [search] = useSearchParams()
  const view = Number.parseInt(search.get("view") || "0")

  const feed = useFeed({
    id,
  })
  const feedData = feed.data?.feed as FeedModel

  const entries = useEntriesPreview({
    id,
  })

  const Item: FC<UniversalItemProps> = getItemComponentByView(view as FeedViewType)

  const { t } = useTranslation()
  return (
    <>
      {feed.isLoading ? (
        <LoadingCircle size="large" className="center absolute inset-0" />
      ) : (
        feed.data?.feed && (
          <div
            className={cn(
              "mx-auto mt-12 flex w-full flex-col items-center p-4 lg:p-0",
              views[view].gridMode ? "max-w-full" : "max-w-prose",
            )}
          >
            <FeedIcon
              fallback
              feed={feed.data.feed}
              className="mask-squircle mask shrink-0"
              size={64}
            />
            <div className="flex flex-col items-center">
              <div className="mb-2 mt-4 flex items-center text-2xl font-bold">
                <h1>{feed.data.feed.title}</h1>
                <FeedCertification feed={feed.data.feed} />
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

            {children.actions}
            <div
              className={cn(
                "w-full pb-12 pt-8",
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
                  <div className="rounded-xl pl-3 duration-300 hover:bg-theme-item-active">
                    <Item
                      entryPreview={{
                        entries: entry,
                        feeds: feedData,
                        read: true,
                        feedId: feedData.id!,
                      }}
                      entryId={entry.id}
                    />
                  </div>
                </a>
              ))}
            </div>
          </div>
        )
      )}
    </>
  )
}
