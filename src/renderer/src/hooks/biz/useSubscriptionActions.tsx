import { Kbd } from "@renderer/components/ui/kbd/Kbd"
import { apiClient } from "@renderer/lib/api-fetch"
import { Queries } from "@renderer/queries"
import type { SubscriptionFlatModel } from "@renderer/store/subscription"
import { subscriptionActions } from "@renderer/store/subscription"
import { feedUnreadActions } from "@renderer/store/unread"
import { useMutation } from "@tanstack/react-query"
import { useHotkeys } from "react-hotkeys-hook"
import { toast } from "sonner"

import { navigateEntry } from "./useNavigateEntry"
import { getRouteParams } from "./useRouteParams"

export const useDeleteSubscription = ({
  onSuccess,
}: {
  onSuccess?: () => void
}) =>
  useMutation({
    mutationFn: async (subscription: SubscriptionFlatModel) =>
      subscriptionActions.unfollow(subscription.feedId).then((feed) => {
        Queries.subscription.byView(subscription.view).invalidate()
        feedUnreadActions.updateByFeedId(subscription.feedId, 0)

        if (!subscription) return
        if (!feed) return
        const undo = async () => {
          // TODO store action
          await apiClient.subscriptions.$post({
            json: {
              url: feed.url,
              view: subscription.view,
              category: subscription.category,
              isPrivate: subscription.isPrivate,
            },
          })

          Queries.subscription.byView(subscription.view).invalidate()
          feedUnreadActions.fetchUnreadByView(subscription.view)

          toast.dismiss(toastId)
        }
        const toastId = toast(
          <UnfollowInfo title={feed.title!} undo={undo} />,
          {
            duration: 3000,
            action: {
              label: (
                <span className="flex items-center gap-1">
                  Undo
                  <Kbd className="inline-flex items-center border border-border bg-transparent dark:text-white">Meta+Z</Kbd>
                </span>
              ),
              onClick: undo,
            },
          },
        )
      }),

    onSuccess: (_) => {
      onSuccess?.()
    },
    onMutate(variables) {
      if (getRouteParams().feedId === variables.feedId) {
        navigateEntry({
          feedId: null,
          entryId: null,
          view: getRouteParams().view,
        })
      }
    },
  })

const UnfollowInfo = ({ title, undo }: { title: string, undo: () => any }) => {
  useHotkeys("ctrl+z,meta+z", undo, {
    scopes: ["home"],
    preventDefault: true,
  })
  return (
    <>
      Feed
      {" "}
      <i className="mr-px font-semibold">{title}</i>
      {" "}
      has been unfollowed.
    </>
  )
}
