import { FeedIcon } from "@renderer/components/feed-icon"
import { FollowDialog } from "@renderer/components/follow/dialog"
import { Dialog } from "@renderer/components/ui/dialog"
import { ToastAction } from "@renderer/components/ui/toast"
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipTrigger,
} from "@renderer/components/ui/tooltip"
import { useToast } from "@renderer/components/ui/use-toast"
import { useMainLayoutContext } from "@renderer/contexts/outlet/main-layout"
import { levels } from "@renderer/lib/constants"
import dayjs from "@renderer/lib/dayjs"
import { showNativeMenu } from "@renderer/lib/native-menu"
import { apiFetch } from "@renderer/lib/queries/api-fetch"
import { SubscriptionResponse } from "@renderer/lib/types"
import { cn } from "@renderer/lib/utils"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
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
  const { activeList, setActiveList } = useMainLayoutContext()

  const setFeedActive = (feed: SubscriptionResponse[number]) => {
    view !== undefined &&
      setActiveList?.({
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
            Feed <i className="mr-px font-semibold">{variables.feeds.title}</i>{" "}
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
        onDoubleClick={() =>
          window.open(
            `${import.meta.env.VITE_WEB_URL}/feed/${feed.feedId}`,
            "_blank",
          )
        }
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
                    "_blank",
                  ),
              },
              {
                type: "text",
                label: "Open Site in Browser",
                click: () => window.open(feed.feeds.siteUrl, "_blank"),
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
        {!!feed.unread && (
          <div className="ml-2 text-xs text-zinc-500">{feed.unread}</div>
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
