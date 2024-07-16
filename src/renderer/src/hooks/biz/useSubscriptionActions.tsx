import { apiClient } from "@renderer/lib/api-fetch"
import { Queries } from "@renderer/queries"
import type { SubscriptionFlatModel } from "@renderer/store/subscription"
import { subscriptionActions } from "@renderer/store/subscription"
import { feedUnreadActions } from "@renderer/store/unread"
import { useMutation } from "@tanstack/react-query"
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
              },
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
