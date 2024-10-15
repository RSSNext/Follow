import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { toast } from "sonner"

import { PoweredByFooter } from "~/components/common/PoweredByFooter"
import { FeedCertification } from "~/components/feed-certification"
import { FeedIcon } from "~/components/feed-icon"
import { FollowIcon } from "~/components/icons/follow"
import { Button } from "~/components/ui/button"
import { LoadingCircle } from "~/components/ui/loading"
import { usePresentFeedFormModal } from "~/hooks/biz/useFeedFormModal"
import { useTitle } from "~/hooks/common"
import type { ListModel } from "~/models"
import { useList } from "~/queries/lists"
import { useFeedById } from "~/store/feed/hooks"

export function Component() {
  const { id } = useParams()

  const list = useList({
    id: id!,
  })
  const listData = list.data?.list as ListModel
  const isSubscribed = !!list.data?.subscription

  const { t } = useTranslation("external")
  useTitle(list.data?.list.title)
  const presentFeedFormModal = usePresentFeedFormModal()
  return (
    <>
      {list.isLoading ? (
        <LoadingCircle size="large" className="center fixed inset-0" />
      ) : (
        list.data?.list && (
          <div className="mx-auto mt-12 flex w-full max-w-5xl flex-col items-center justify-center p-4 lg:p-0">
            <FeedIcon
              fallback
              feed={list.data.list}
              className="mask-squircle mask shrink-0"
              size={64}
            />
            <div className="flex flex-col items-center">
              <div className="mb-2 mt-4 flex items-center text-2xl font-bold">
                <h1>{list.data.list.title}</h1>
                <FeedCertification feed={list.data.list} />
              </div>
              <div className="mb-8 text-sm text-zinc-500">{list.data.list.description}</div>
            </div>
            <div className="mb-4 text-sm">
              {t("feed.followsAndFeeds", {
                subscriptionCount: list.data?.subscriptionCount,
                subscriptionNoun: t("feed.follower", { count: list.data?.subscriptionCount }),
                feedsCount: list.data?.feedCount || 0,
                feedsNoun: t("feed.feeds", { count: listData?.feedIds?.length }),
                appName: APP_NAME,
              })}
            </div>
            <span className="center mb-8 flex gap-4">
              <Button
                variant={"outline"}
                onClick={() => {
                  toast.success(t("copied_link"))
                  navigator.clipboard.writeText(id!)
                }}
              >
                Copy List ID
              </Button>
              <Button
                variant={isSubscribed ? "outline" : undefined}
                onClick={() => {
                  presentFeedFormModal({
                    listId: id!,
                  })
                }}
              >
                <FollowIcon className="mr-2 size-3" />
                {isSubscribed ? "Followed" : <>{APP_NAME}</>}
              </Button>
            </span>
            <div className="flex w-full max-w-3xl flex-col gap-4 pb-12 pt-8">
              {listData.feedIds
                ?.slice(0, 5)
                .map((feedId) => <FeedRow feedId={feedId} key={feedId} />)}
              {"feedCount" in list.data && (
                <div
                  onClick={() => {
                    presentFeedFormModal({
                      listId: id!,
                    })
                  }}
                  className="text-sm text-zinc-500"
                >
                  {t("feed.follow_to_view_all", {
                    count: list.data.feedCount || 0,
                  })}
                </div>
              )}
            </div>
            <PoweredByFooter className="mt-20 pb-12" />
          </div>
        )
      )}
    </>
  )
}

const FeedRow = ({ feedId }: { feedId: string }) => {
  const feed = useFeedById(feedId)
  if (!feed) return null
  return (
    <a
      className="relative flex cursor-pointer items-center text-base"
      href={`/share/feeds/${feed.id}`}
      target="_blank"
      key={feed.id}
    >
      <FeedIcon fallback feed={feed} className="mask-squircle mask mr-2 shrink-0" size={20} />
      {feed.title}
      <FeedCertification feed={feed} />
    </a>
  )
}
