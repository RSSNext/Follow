import { useCallback } from "react"

import { useAuthQuery } from "~/hooks/common/useBizQuery"
import { Queries } from "~/queries"

import { useSubscriptionStore } from "../subscription/store"
import { useFeedUnreadStore } from "."

export const useUnreadByView = () => {
  useAuthQuery(Queries.subscription.byView())
  const idByView = useSubscriptionStore((state) => state.feedIdByView)
  const totalUnread = useFeedUnreadStore(
    useCallback(
      (state) => {
        const unread = {} as Record<number, number>

        for (const view in idByView) {
          unread[view] = idByView[view].reduce(
            (acc: number, feedId: string) => acc + (state.data[feedId] || 0),
            0,
          )
        }
        return unread
      },
      [idByView],
    ),
  )

  return totalUnread
}
