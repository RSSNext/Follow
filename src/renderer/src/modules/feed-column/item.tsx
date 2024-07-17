import { getMainContainerElement } from "@renderer/atoms/dom"
import { getMe } from "@renderer/atoms/user"
import { FeedIcon } from "@renderer/components/feed-icon"
import { useModalStack } from "@renderer/components/ui/modal/stacked/hooks"
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipTrigger,
} from "@renderer/components/ui/tooltip"
import { useNavigateEntry } from "@renderer/hooks/biz/useNavigateEntry"
import { useRouteParamsSelector } from "@renderer/hooks/biz/useRouteParams"
import { useDeleteSubscription } from "@renderer/hooks/biz/useSubscriptionActions"
import dayjs from "@renderer/lib/dayjs"
import { nextFrame } from "@renderer/lib/dom"
import { showNativeMenu } from "@renderer/lib/native-menu"
import { cn } from "@renderer/lib/utils"
import { getFeedById, useFeedById } from "@renderer/store/feed"
import { useSubscriptionByFeedId } from "@renderer/store/subscription"
import { useFeedUnreadStore } from "@renderer/store/unread"
import { WEB_URL } from "@shared/constants"
import { memo, useCallback } from "react"

import { useFeedClaimModal } from "../claim/hooks"
import { FeedForm } from "../discover/feed-form"

interface FeedItemProps {
  feedId: string
  view?: number
  className?: string
  showUnreadCount?: boolean
}
const FeedItemImpl = ({
  view,
  feedId,
  className,
  showUnreadCount = true,
}: FeedItemProps) => {
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

  const deleteSubscription = useDeleteSubscription({})

  const feedUnread = useFeedUnreadStore((state) => state.data[feedId] || 0)
  const { present } = useModalStack()

  const isActive = useRouteParamsSelector(
    (routerParams) => routerParams.feedId === feedId,
  )

  const feed = useFeedById(feedId)

  const claimFeed = useFeedClaimModal({
    feedId,
  })

  if (!feed) return null
  return (
    <div
      className={cn(
        "flex w-full items-center justify-between rounded-md py-[2px] pr-2.5 text-sm font-medium leading-loose",
        isActive && "bg-native-active",
        className,
      )}
      onClick={handleNavigate}
      onDoubleClick={() => {
        window.open(`${WEB_URL}/feed/${feedId}?view=${view}`, "_blank")
      }}
      onContextMenu={(e) => {
        showNativeMenu(
          [
            {
              type: "text",
              label: "Edit",

              click: () => {
                present({
                  title: "Edit Feed",
                  content: ({ dismiss }) => (
                    <FeedForm asWidget id={feedId} onSuccess={dismiss} />
                  ),
                })
              },
            },
            {
              type: "text",
              label: "Unfollow",
              click: () => deleteSubscription.mutate(subscription),
            },
            {
              type: "separator",
            },
            !feed.ownerUserId &&
            !!feed.id && {
              type: "text",
              label: "Claim",
              click: () => {
                claimFeed()
              },
            },
            feed.ownerUserId === getMe()?.id && {
              type: "text",
              label: "This feed is owned by you",
            },
            {
              type: "separator",
            },

            {
              type: "text",
              label: "Open Feed in Browser",
              click: () =>
                window.open(`${WEB_URL}/feed/${feedId}?view=${view}`, "_blank"),
            },
            {
              type: "text",
              label: "Open Site in Browser",
              click: () => {
                const feed = getFeedById(feedId)
                if (feed) {
                  feed.siteUrl && window.open(feed.siteUrl, "_blank")
                }
              },
            },
          ],
          e,
        )
      }}
    >
      <div
        className={cn(
          "flex min-w-0 items-center",
          feed.errorAt && "text-red-900",
        )}
      >
        <FeedIcon feed={feed} size={16} />
        <div
          className={cn(
            "truncate",
            !showUnreadCount &&
            (feedUnread ? "font-bold" : "font-medium opacity-70"),
          )}
        >
          {feed.title}
        </div>
        {feed.errorAt && (
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <i className="i-mgc-wifi-off-cute-re ml-1 shrink-0 text-base" />
              </TooltipTrigger>
              <TooltipPortal>
                <TooltipContent>
                  <div className="flex items-center gap-1">
                    <i className="i-mgc-time-cute-re" />
                    Error since
                    {" "}
                    {dayjs
                      .duration(
                        dayjs(feed.errorAt).diff(dayjs(), "minute"),
                        "minute",
                      )
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
          </TooltipProvider>
        )}
        {subscription.isPrivate && (
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <i className="i-mgc-eye-close-cute-re ml-1 shrink-0 text-base" />
              </TooltipTrigger>
              <TooltipPortal>
                <TooltipContent>
                  Not publicly visible on your profile page
                </TooltipContent>
              </TooltipPortal>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      {showUnreadCount && !!feedUnread && (
        <div className="ml-2 text-xs text-zinc-500 dark:text-neutral-400">
          {feedUnread}
        </div>
      )}
    </div>
  )
}

export const FeedItem = memo(FeedItemImpl)
