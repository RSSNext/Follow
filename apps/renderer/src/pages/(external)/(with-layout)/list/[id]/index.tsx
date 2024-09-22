import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"

import { PoweredByFooter } from "~/components/common/PoweredByFooter"
import { FeedIcon } from "~/components/feed-icon"
import { FollowIcon } from "~/components/icons/follow"
import { Button } from "~/components/ui/button"
import { LoadingCircle } from "~/components/ui/loading"
import { usePresentFeedFormModal } from "~/hooks/biz/useFeedFormModal"
import { useTitle } from "~/hooks/common"
import type { ListModel } from "~/models"
import { useFeed } from "~/queries/feed"

export function Component() {
  const { id } = useParams()

  const feed = useFeed({
    id,
    isList: true,
  })
  const listData = feed.data?.feed as ListModel

  const { t } = useTranslation("external")
  useTitle(feed.data?.feed.title)
  const presentFeedFormModal = usePresentFeedFormModal()
  return (
    <div className="center h-screen">
      {feed.isLoading ? (
        <LoadingCircle size="large" className="center fixed inset-0" />
      ) : (
        feed.data?.feed && (
          <div className="mx-auto flex max-w-5xl flex-col items-center justify-center p-4 lg:p-0">
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
              {t("feed.followsAndFeeds", {
                subscriptionCount: feed.data.subscriptionCount,
                subscriptionNoun: t("feed.follower", { count: feed.data.subscriptionCount }),
                feedsCount: listData?.feeds?.length,
                feedsNoun: t("feed.feeds", { count: listData?.feeds?.length }),
                appName: APP_NAME,
              })}
            </div>
            <span className="center mb-8 flex gap-4">
              <Button
                onClick={() => {
                  presentFeedFormModal(id!)
                }}
              >
                <FollowIcon className="mr-1 size-3" />
                {APP_NAME}
              </Button>
            </span>
            <PoweredByFooter className="mt-20 pb-12" />
          </div>
        )
      )}
    </div>
  )
}
