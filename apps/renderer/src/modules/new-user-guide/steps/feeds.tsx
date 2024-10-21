import { useQuery } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"

import { getTrendingAggregates } from "~/api/trending"
import { FeedIcon } from "~/components/feed-icon"
import { PhUsersBold } from "~/components/icons/users"
import { Button } from "~/components/ui/button"
import { LoadingWithIcon } from "~/components/ui/loading"
import { useFollow } from "~/hooks/biz/useFollow"
import { cn } from "~/lib/utils"

export function TrendingFeeds() {
  const { data } = useQuery({
    queryKey: ["trending"],
    queryFn: () => {
      return getTrendingAggregates()
    },
  })

  const follow = useFollow()
  const { t } = useTranslation()

  return (
    <ul className="flex h-[400px] w-[450px] flex-col items-center justify-center gap-1 overflow-y-auto">
      {data ? (
        data.trendingFeeds.map((feed) => {
          return (
            <li
              className={cn(
                "group flex w-full items-center gap-1 rounded-md px-2 py-1 duration-200 hover:bg-theme-item-hover",
                "relative",
              )}
              key={feed.id}
            >
              <a
                target="_blank"
                href={`/feed/${feed.id}`}
                className="flex grow items-center gap-2 py-1"
              >
                <div>
                  <FeedIcon feed={feed} size={24} className="rounded" />
                </div>
                <div className="flex w-full min-w-0 grow items-center">
                  <div className={"truncate"}>{feed.title}</div>
                </div>
              </a>

              <div className="pr-2">
                <span className="flex -translate-y-0.5 items-center gap-0.5 text-xs tabular-nums text-gray-500">
                  <PhUsersBold className="size-3" />
                  {(feed as any).subscriberCount}
                </span>

                <Button
                  type="button"
                  buttonClassName="absolute inset-y-1.5 right-1.5 font-medium opacity-0 duration-200 group-hover:opacity-100"
                  onClick={() => {
                    follow({ isList: false, id: feed.id })
                  }}
                >
                  {t("feed_form.follow")}
                </Button>
              </div>
            </li>
          )
        })
      ) : (
        <LoadingWithIcon
          icon={<i className="i-mingcute-trending-up-line text-3xl" />}
          size="large"
        />
      )}
    </ul>
  )
}
