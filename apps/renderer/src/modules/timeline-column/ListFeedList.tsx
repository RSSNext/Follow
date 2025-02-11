import { ScrollArea } from "@follow/components/ui/scroll-area/index.js"
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from "@follow/components/ui/tooltip/index.js"
import { cn } from "@follow/utils/utils"
import dayjs from "dayjs"
import type { FC, MouseEventHandler } from "react"
import { useTranslation } from "react-i18next"

import { useNavigateEntry } from "~/hooks/biz/useNavigateEntry"
import { useRouteParamsSelector } from "~/hooks/biz/useRouteParams"
import { useList } from "~/queries/lists"
import { useFeedById } from "~/store/feed"
import { useListById } from "~/store/list"

import { FeedIcon } from "../feed/feed-icon"
import { FeedTitle } from "../feed/feed-title"
import { feedColumnStyles } from "./styles"

export const ListFeedList: FC<{ listId: string }> = ({ listId }) => {
  const { t } = useTranslation()
  const cachedList = useListById(listId)
  const res = useList({ id: listId, noExtras: true })
  const list = res.data?.list || cachedList
  const currentFeedId = useRouteParamsSelector((s) => s.feedId)

  if (!list) return null
  return (
    <>
      <div className="mx-3 mb-1 flex items-center justify-between px-2.5 py-1">
        <div className="text-base font-bold">{list?.title || t("words.inbox")}</div>
      </div>
      <ScrollArea.ScrollArea flex viewportClassName="!px-3" rootClassName="h-full">
        {list?.feedIds.map((feedId) => (
          <FeedItem key={feedId} feedId={feedId} isActive={feedId === currentFeedId} />
        ))}
      </ScrollArea.ScrollArea>
    </>
  )
}

interface FeedItemProps {
  feedId: string
  isActive: boolean
}
const FeedItem = ({ feedId, isActive }: FeedItemProps) => {
  const feed = useFeedById(feedId)
  const { t } = useTranslation()
  const navigate = useNavigateEntry()

  if (!feed) return null

  const handleClick: MouseEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation()
    navigate({ feedId })
  }
  return (
    <div
      className={cn(
        "my-px px-2.5 py-0.5",
        feedColumnStyles.item,
        isActive && "bg-theme-item-active",
      )}
      onClick={handleClick}
    >
      <div
        className={cn(
          "flex min-w-0 items-center",
          feed.errorAt && "text-red-900 dark:text-red-500",
        )}
      >
        <FeedIcon fallback feed={feed} size={16} />
        <FeedTitle feed={feed} />
        {feed?.errorAt && (
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <i className="i-mgc-wifi-off-cute-re ml-1 shrink-0 text-base" />
            </TooltipTrigger>
            <TooltipPortal>
              <TooltipContent>
                <div className="flex items-center gap-1">
                  <i className="i-mgc-time-cute-re" />
                  {t("feed_item.error_since")}{" "}
                  {dayjs
                    .duration(dayjs(feed.errorAt).diff(dayjs(), "minute"), "minute")
                    .humanize(true)}
                </div>
                {!!feed.errorMessage && (
                  <div className="flex items-center gap-1">
                    <i className="i-mgc-bug-cute-re" />
                    {feed.errorMessage}
                  </div>
                )}
              </TooltipContent>
            </TooltipPortal>
          </Tooltip>
        )}
      </div>
    </div>
  )
}
