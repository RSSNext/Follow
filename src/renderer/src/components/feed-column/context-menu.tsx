import { useState } from "react"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from "@renderer/components/ui/context-menu"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@renderer/components/ui/use-toast"
import { ToastAction } from "@renderer/components/ui/toast"
import { SubscriptionResponse } from "@renderer/lib/types"
import { apiFetch } from "@renderer/lib/queries/api-fetch"
import { FollowDialog } from "@renderer/components/follow/dialog"
import { Dialog, DialogTrigger } from "@renderer/components/ui/dialog"

export function FeedContextMenu({
  feed,
  children,
}: {
  feed: SubscriptionResponse[number]
  children: React.ReactNode
}) {
  const [dialogOpen, setDialogOpen] = useState(false)
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
                  // private: variables.private,
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
      <ContextMenu>
        <ContextMenuTrigger>{children}</ContextMenuTrigger>
        <ContextMenuContent onClick={(e) => e.stopPropagation()}>
          <DialogTrigger asChild>
            <ContextMenuItem>Edit</ContextMenuItem>
          </DialogTrigger>
          <ContextMenuItem onClick={() => deleteMutation.mutate(feed)}>
            Unfollow
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem>Open Feed in Browser</ContextMenuItem>
          <ContextMenuItem>Open Site in Browser</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <FollowDialog
        feed={feed}
        onSuccess={() => setDialogOpen(false)}
        isSubscribed={true}
      />
    </Dialog>
  )
}
