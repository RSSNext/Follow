import { apiClient } from "@renderer/lib/api-fetch"
import { Queries } from "@renderer/queries"
import type { SubscriptionPlainModel } from "@renderer/store"
import { getFeedById, unreadActions } from "@renderer/store"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

export const useDeleteSubscription = ({
  onSuccess,
}: {
  onSuccess?: () => void
}) => useMutation({
  mutationFn: async (feed: SubscriptionPlainModel) =>
    apiClient.subscriptions.$delete({
      json: {
        feedId: feed.feedId,
      },
    }),

  onSuccess: (_, variables) => {
    Queries.subscription.byView(variables.view).invalidate()
    unreadActions.updateByFeedId(variables.feedId, 0)

    const feed = getFeedById(variables.feedId)

    if (!feed) return
    toast(
      <>
        Feed
        {" "}
        <i className="mr-px font-semibold">{feed.title}</i>
        {" "}
        has been
        unfollowed.
      </>,
      {
        duration: 3000,
        action: {
          label: "Undo",
          onClick: async () => {
            await apiClient.subscriptions.$post({
              json: {
                url: feed.url,
                view: variables.view,
                category: variables.category,
                isPrivate: variables.isPrivate,
              },
            })

            Queries.subscription.byView(variables.view).invalidate()
            unreadActions.fetchUnreadByView(variables.view)
          },
        },
      },
    )
    onSuccess?.()
  },
})
