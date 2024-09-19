import { WEB_URL } from "@follow/shared/constants"
import dayjs from "dayjs"
import { memo, useCallback, useState } from "react"
import { useTranslation } from "react-i18next"

import { getMainContainerElement } from "~/atoms/dom"
import { FeedCertification } from "~/components/feed-certification"
import { FeedIcon } from "~/components/feed-icon"
import { OouiUserAnonymous } from "~/components/icons/OouiUserAnonymous"
import { Tooltip, TooltipContent, TooltipPortal, TooltipTrigger } from "~/components/ui/tooltip"
import { useFeedActions } from "~/hooks/biz/useFeedActions"
import { useNavigateEntry } from "~/hooks/biz/useNavigateEntry"
import { useRouteParamsSelector } from "~/hooks/biz/useRouteParams"
import { useAnyPointDown } from "~/hooks/common"
import { nextFrame } from "~/lib/dom"
import { getNewIssueUrl } from "~/lib/issues"
import { showNativeMenu } from "~/lib/native-menu"
import { cn } from "~/lib/utils"
import { getPreferredTitle, useFeedById } from "~/store/feed"
import { useSubscriptionByFeedId } from "~/store/subscription"
import { useFeedUnreadStore } from "~/store/unread"

import { UnreadNumber } from "./unread-number"

interface FeedItemProps {
  feedId: string
  view?: number
  className?: string
  showUnreadCount?: boolean
}
const FeedItemImpl = ({ view, feedId, className, showUnreadCount = true }: FeedItemProps) => {
  const { t } = useTranslation()
  const subscription = useSubscriptionByFeedId(feedId)
  const navigate = useNavigateEntry()
  const handleNavigate: React.MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      e.stopPropagation()
      if (view === undefined) return
      navigate({
        feedId,
        entryId: null,
        view,
      })
      // focus to main container in order to let keyboard can navigate entry items by arrow keys
      nextFrame(() => {
        getMainContainerElement()?.focus()
      })
    },
    [feedId, navigate, view],
  )

  const feedUnread = useFeedUnreadStore((state) => state.data[feedId] || 0)

  const isActive = useRouteParamsSelector((routerParams) => routerParams.feedId === feedId)

  const feed = useFeedById(feedId)

  const { items } = useFeedActions({ feedId, view })

  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false)
  useAnyPointDown(() => {
    setIsContextMenuOpen(false)
  })
  if (!feed) return null

  return (
    <>
      <div
        data-feed-id={feedId}
        className={cn(
          "flex w-full items-center justify-between rounded-md py-[2px] pr-2.5 text-sm font-medium leading-loose",
          (isActive || isContextMenuOpen) && "bg-native-active",

          className,
        )}
        onClick={handleNavigate}
        onDoubleClick={() => {
          window.open(`${WEB_URL}/feed/${feedId}?view=${view}`, "_blank")
        }}
        onContextMenu={(e) => {
          setIsContextMenuOpen(true)
          const nextItems = items.concat()
          if (feed.errorAt && feed.errorMessage) {
            nextItems.push(
              {
                type: "separator",
                disabled: false,
              },
              {
                label: "Feedback",
                type: "text",
                click: () => {
                  window.open(
                    getNewIssueUrl({
                      body:
                        `### Error\n\nError Message: ${feed.errorMessage}\n\n### Info\n\n` +
                        `\`\`\`json\n${JSON.stringify(feed, null, 2)}\n\`\`\``,
                      label: "bug",
                      title: `Feed Error: ${feed.title}, ${feed.errorMessage}`,
                    }),
                  )
                },
              },
            )
          }
          showNativeMenu(nextItems, e)
        }}
      >
        <div
          className={cn(
            "flex min-w-0 items-center",
            feed.errorAt && "text-red-900 dark:text-red-500",
          )}
        >
          <FeedIcon fallback feed={feed} size={16} />
          <div
            className={cn(
              "truncate",
              !showUnreadCount && (feedUnread ? "font-bold" : "font-medium opacity-70"),
            )}
          >
            {getPreferredTitle(feed)}
          </div>
          <FeedCertification feed={feed} className="text-[15px]" />
          {feed.errorAt && (
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
          {subscription.isPrivate && (
            <Tooltip delayDuration={300}>
              <TooltipTrigger>
                <OouiUserAnonymous className="ml-1 shrink-0 text-base" />
              </TooltipTrigger>
              <TooltipPortal>
                <TooltipContent>{t("feed_item.not_publicly_visible")}</TooltipContent>
              </TooltipPortal>
            </Tooltip>
          )}
        </div>
        <UnreadNumber unread={feedUnread} className="ml-2" />
      </div>
    </>
  )
}

export const FeedItem = memo(FeedItemImpl)
