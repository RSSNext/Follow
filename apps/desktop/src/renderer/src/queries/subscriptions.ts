import type { FeedViewType } from "@follow/constants"

import { apiClient } from "~/lib/api-fetch"
import { defineQuery } from "~/lib/defineQuery"
import { subscriptionActions } from "~/store/subscription"
import { feedUnreadActions } from "~/store/unread"

export const subscription = {
  byView: (view?: FeedViewType) =>
    defineQuery(["subscriptions", view], async () => subscriptionActions.fetchByView(view), {
      rootKey: ["subscriptions"],
    }),
  categories: (view?: number) =>
    defineQuery(["subscription-categories", view], async () => {
      const res = await apiClient.categories.$get({
        query: { view: view ? String(view) : undefined },
      })

      return res.data
    }),

  unreadAll: () => defineQuery(["unread-all"], async () => feedUnreadActions.fetchUnreadAll()),
}
