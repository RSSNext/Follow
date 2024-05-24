import { useState } from "react"
import { levels } from "@renderer/lib/constants"
import { ActivedList, SubscriptionResponse } from "@renderer/lib/types"
import { cn } from "@renderer/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  TooltipPortal,
} from "@renderer/components/ui/tooltip"
import { FeedIcon } from "@renderer/components/feed-icon"
import dayjs from "@renderer/lib/dayjs"
import { showNativeMenu } from "@renderer/lib/native-menu"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiFetch } from "@renderer/lib/queries/api-fetch"
import { Dialog } from "@renderer/components/ui/dialog"
import { FollowDialog } from "@renderer/components/follow/dialog"
import { useToast } from "@renderer/components/ui/use-toast"
import { ToastAction } from "@renderer/components/ui/toast"
import { useOutletContext } from "react-router-dom"

export function FeedItem({
  feed,
  view,
  className,
}: {
  feed: SubscriptionResponse[number]
  view?: number
  className?: string
}) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const { activedList, setActivedList } = useOutletContext<{
    activedList: ActivedList
    setActivedList: (value: ActivedList) => void
  }>()

  const setFeedActive = (feed: SubscriptionResponse[number]) => {
    view !== undefined &&
      setActivedList?.({
        level: levels.feed,
        id: feed.feedId,
        name: feed.feeds.title || "",
        view,
      })
  }

  const { toast } = useToast()

  const queryClient = useQueryClient()
  const deleteMutation = useMutation({
    mutationFn: async (feed: SubscriptionResponse[number]) =>
      apiFetch("/subscriptions", {
        method: "DELETE",
        body: {
          feedId: feed.feedId,
        },
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["subscriptions", feed.view],
      })
      toast({
        duration: 3000,
        description: (
          <>
            Feed <i className="font-semibold mr-px">{variables.feeds.title}</i>{" "}
            has been unfollowed.
          </>
        ),
        action: (
          <ToastAction
            altText="Undo"
            onClick={async () => {
              await apiFetch("/subscriptions", {
                method: "POST",
                body: {
                  url: variables.feeds.url,
                  view: feed.view,
                  category: variables.category,
                  isPrivate: variables.isPrivate,
                },
              })
              queryClient.invalidateQueries({
                queryKey: ["subscriptions", feed.view],
              })
            }}
          >
            Undo
          </ToastAction>
        ),
      })
    },
  })

  return (
    <Dialog key={feed.feedId} open={dialogOpen} onOpenChange={setDialogOpen}>
      <div
        className={cn(
          "flex items-center justify-between text-sm font-medium leading-loose w-full pr-2.5 py-[2px] rounded-md",
          activedList?.level === levels.feed &&
            activedList.id === feed.feedId &&
            "bg-native-active",
          className,
        )}
        onClick={(e) => {
          e.stopPropagation()
          setFeedActive(feed)
        }}
        onContextMenu={(e) => {
          showNativeMenu(
            [
              {
                type: "text",
                label: "Edit",
                click: () => setDialogOpen(true),
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
                    `${import.meta.env.VITE_WEB_URL}/feed/${feed.feedId}`,
                  ),
              },
              {
                type: "text",
                label: "Open Site in Browser",
                click: () => window.open(feed.feeds.siteUrl),
              },
            ],
            e,
          )
        }}
      >
        <div
          className={cn(
            "flex items-center min-w-0",
            feed.feeds.errorAt && "text-red-900",
          )}
        >
          <FeedIcon feed={feed.feeds} className="w-4 h-4" />
          <div className="truncate">{feed.feeds.title}</div>
          {feed.feeds.errorAt && (
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <i className="i-mingcute-wifi-off-line shrink-0 ml-1 text-base" />
                </TooltipTrigger>
                <TooltipPortal>
                  <TooltipContent>
                    Error since{" "}
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
                  <i className="i-mingcute-eye-close-line shrink-0 ml-1 text-base" />
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
        {!!feed.unread && (
          <div className="text-xs text-zinc-500 ml-2">{feed.unread}</div>
        )}
        <FollowDialog
          feed={feed}
          onSuccess={() => setDialogOpen(false)}
          isSubscribed={true}
        />
      </div>
    </Dialog>
  )
}
