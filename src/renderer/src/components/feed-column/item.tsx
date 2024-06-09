import { FeedIcon } from "@renderer/components/feed-icon"
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipTrigger,
} from "@renderer/components/ui/tooltip"
import { apiClient } from "@renderer/lib/api-fetch"
import { levels } from "@renderer/lib/constants"
import dayjs from "@renderer/lib/dayjs"
import { showNativeMenu } from "@renderer/lib/native-menu"
import { cn } from "@renderer/lib/utils"
import type { SubscriptionResponse } from "@renderer/models"
import { Queries } from "@renderer/queries"
import {
  feedActions,
  useFeedActiveList,
  useUnreadStore,
} from "@renderer/store"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

export function FeedItem({
  feed,
  view,
  className,
}: {
  feed: SubscriptionResponse[number]
  view?: number
  className?: string
}) {
  const activeList = useFeedActiveList()
  const { setActiveList } = feedActions

  const setFeedActive = (feed: SubscriptionResponse[number]) => {
    if (view === undefined) return

    setActiveList({
      level: levels.feed,
      id: feed.feedId,
      name: feed.feeds.title || "",
      view,
    })
  }

  const deleteMutation = useMutation({
    mutationFn: async (feed: SubscriptionResponse[number]) =>
      apiClient.subscriptions.$delete({
        json: {
          feedId: feed.feedId,
        },
      }),

    onSuccess: (_, variables) => {
      Queries.subscription.byView(variables.view).invalidate()

      toast(
        <>
          Feed
          {" "}
          <i className="mr-px font-semibold">{variables.feeds.title}</i>
          {" "}
          has been unfollowed.
        </>,
        {
          duration: 3000,
          action: {
            label: "Undo",
            onClick: async () => {
              await apiClient.subscriptions.$post({
                json: {
                  url: variables.feeds.url,
                  view: variables.view,
                  category: variables.category,
                  isPrivate: variables.isPrivate,
                },
              })

              Queries.subscription.byView(feed.view).invalidate()
            },
          },
        },
      )
    },
  })

  const feedUnread = useUnreadStore((state) => state.data[feed.feedId] || 0)
  return (
    <div
      className={cn(
        "flex w-full items-center justify-between rounded-md py-[2px] pr-2.5 text-sm font-medium leading-loose",
        activeList?.level === levels.feed &&
        activeList.id === feed.feedId &&
        "bg-native-active",
        className,
      )}
      onClick={(e) => {
        e.stopPropagation()
        setFeedActive(feed)
      }}
      onDoubleClick={() => {
        window.open(
          `${import.meta.env.VITE_WEB_URL}/feed/${feed.feedId}?view=${view}`,
          "_blank",
        )
      }}
      onContextMenu={(e) => {
        showNativeMenu(
          [
            {
              type: "text",
              label: "Edit",
              click: () => window.open(`follow://add?id=${feed.feedId}`),
            },
            {
              type: "text",
              label: "Unfollow",
              click: () => deleteMutation.mutate(feed),
            },
            {
              type: "separator",
            },
            {
              type: "text",
              label: "Open Feed in Browser",
              click: () =>
                window.open(
                  `${import.meta.env.VITE_WEB_URL}/feed/${
                    feed.feedId
                  }?view=${view}`,
                  "_blank",
                ),
            },
            {
              type: "text",
              label: "Open Site in Browser",
              click: () =>
                feed.feeds.siteUrl && window.open(feed.feeds.siteUrl, "_blank"),
            },
          ],
          e,
        )
      }}
    >
      <div
        className={cn(
          "flex min-w-0 items-center",
          feed.feeds.errorAt && "text-red-900",
        )}
      >
        <FeedIcon feed={feed.feeds} className="size-4" />
        <div className="truncate">{feed.feeds.title}</div>
        {feed.feeds.errorAt && (
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <i className="i-mingcute-wifi-off-line ml-1 shrink-0 text-base" />
              </TooltipTrigger>
              <TooltipPortal>
                <TooltipContent>
                  Error since
                  {" "}
                  {dayjs
                    .duration(
                      dayjs(feed.feeds.errorAt).diff(dayjs(), "minute"),
                      "minute",
                    )
                    .humanize(true)}
                </TooltipContent>
              </TooltipPortal>
            </Tooltip>
          </TooltipProvider>
        )}
        {feed.isPrivate && (
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <i className="i-mingcute-eye-close-line ml-1 shrink-0 text-base" />
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
      {!!feedUnread && (
        <div className="ml-2 text-xs text-zinc-500">{feedUnread}</div>
      )}
    </div>
  )
}
