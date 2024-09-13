import { getMainContainerElement } from "@renderer/atoms/dom"
import { useWhoami } from "@renderer/atoms/user"
import { FeedIcon } from "@renderer/components/feed-icon"
import { OouiUserAnonymous } from "@renderer/components/icons/OouiUserAnonymous"
import { Avatar, AvatarFallback, AvatarImage } from "@renderer/components/ui/avatar"
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from "@renderer/components/ui/tooltip"
import { useFeedActions } from "@renderer/hooks/biz/useFeedActions"
import { useNavigateEntry } from "@renderer/hooks/biz/useNavigateEntry"
import { useRouteParamsSelector } from "@renderer/hooks/biz/useRouteParams"
import { nextFrame } from "@renderer/lib/dom"
import { getNewIssueUrl } from "@renderer/lib/issues"
import { showNativeMenu } from "@renderer/lib/native-menu"
import { cn } from "@renderer/lib/utils"
import { getPreferredTitle, useFeedById } from "@renderer/store/feed"
import { useSubscriptionByFeedId } from "@renderer/store/subscription"
import { useFeedUnreadStore } from "@renderer/store/unread"
import { WEB_URL } from "@shared/constants"
import dayjs from "dayjs"
import { memo, useCallback } from "react"

import { usePresentUserProfileModal } from "../profile/hooks"
import { UnreadNumber } from "./unread-number"

interface FeedItemProps {
  feedId: string
  view?: number
  className?: string
  showUnreadCount?: boolean
}
const FeedItemImpl = ({ view, feedId, className, showUnreadCount = true }: FeedItemProps) => {
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
  const me = useWhoami()
  const presentUserProfile = usePresentUserProfileModal("drawer")

  if (!feed) return null

  return (
    <>
      <div
        data-feed-id={feedId}
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
          {feed.ownerUserId &&
            (feed.ownerUserId === me?.id ? (
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <i className="i-mgc-certificate-cute-fi ml-1.5 shrink-0 text-[15px] text-accent" />
                </TooltipTrigger>

                <TooltipPortal>
                  <TooltipContent className="px-4 py-2">
                    <div className="flex items-center text-base font-semibold">
                      <i className="i-mgc-certificate-cute-fi mr-2 shrink-0 text-accent" />
                      Claimed feed
                    </div>
                    <div>This feed is claimed by you.</div>
                  </TooltipContent>
                </TooltipPortal>
              </Tooltip>
            ) : (
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <i className="i-mgc-certificate-cute-fi ml-1.5 shrink-0 text-[15px] text-amber-500" />
                </TooltipTrigger>

                <TooltipPortal>
                  <TooltipContent className="px-4 py-2">
                    <div className="flex items-center text-base font-semibold">
                      <i className="i-mgc-certificate-cute-fi mr-2 shrink-0 text-amber-500" />
                      Claimed feed
                    </div>
                    <div className="mt-1 flex items-center gap-1.5">
                      <span>This feed is claimed by</span>
                      {feed.owner ? (
                        <Avatar
                          className="inline-flex aspect-square size-5 rounded-full"
                          onClick={(e) => {
                            e.stopPropagation()
                            presentUserProfile(feed.owner!.id)
                          }}
                        >
                          <AvatarImage src={feed.owner.image || undefined} />
                          <AvatarFallback>{feed.owner.name?.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                      ) : (
                        <span>its owner.</span>
                      )}
                    </div>
                  </TooltipContent>
                </TooltipPortal>
              </Tooltip>
            ))}
          {feed.errorAt && (
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <i className="i-mgc-wifi-off-cute-re ml-1 shrink-0 text-base" />
              </TooltipTrigger>
              <TooltipPortal>
                <TooltipContent>
                  <div className="flex items-center gap-1">
                    <i className="i-mgc-time-cute-re" />
                    Error since{" "}
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
                <TooltipContent>Not publicly visible on your profile page</TooltipContent>
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
