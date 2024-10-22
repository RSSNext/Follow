import { UserRole } from "@follow/constants"
import { t } from "i18next"
import { useCallback } from "react"
import { useEventCallback } from "usehooks-ts"

import { useUserRole } from "~/atoms/user"
import { CustomSafeError } from "~/components/errors/helper"
import { useModalStack } from "~/components/ui/modal/stacked"
import { MAX_TRIAL_USER_FEED_SUBSCRIPTION } from "~/constants/limit"
import { useActivationModal } from "~/modules/activation"
import type { FeedFormDataValuesType } from "~/modules/discover/feed-form"
import { FeedForm } from "~/modules/discover/feed-form"
import type { ListFormDataValuesType } from "~/modules/discover/list-form"
import { ListForm } from "~/modules/discover/list-form"
import {
  getSubscriptionByFeedId,
  useFeedSubscriptionCount,
  useListSubscriptionCount,
} from "~/store/subscription"

const useCanFollowMoreInboxAndNotify = () => {
  const role = useUserRole()
  const listCurrentCount = useListSubscriptionCount()
  const feedCurrentCount = useFeedSubscriptionCount()
  const presentActivationModal = useActivationModal()

  return useEventCallback((type: "list" | "feed") => {
    if (role === UserRole.Trial) {
      const LIMIT =
        type !== "list" ? MAX_TRIAL_USER_FEED_SUBSCRIPTION : MAX_TRIAL_USER_FEED_SUBSCRIPTION
      const CURRENT = type === "list" ? listCurrentCount : feedCurrentCount
      const can = CURRENT < LIMIT
      if (!can) {
        presentActivationModal()

        throw new CustomSafeError(
          `Trial user cannot create more ${type}, limit: ${LIMIT}, current: ${CURRENT}`,
          true,
        )
      }
      return can
    } else {
      // const can = currentInboxCount < MAX_INBOX_COUNT
      // if (!can) {
      //   //  TODO
      // }
      // return can

      return true
    }
  })
}

export interface FollowOptions {
  isList: boolean
  id?: string
  url?: string

  onSuccess?: () => void
  defaultValues?: Partial<ListFormDataValuesType> | Partial<FeedFormDataValuesType>
}
export const useFollow = () => {
  const { present } = useModalStack()
  const canFollowMoreInboxAndNotify = useCanFollowMoreInboxAndNotify()

  return useCallback(
    (options?: FollowOptions) => {
      if (options?.isList) {
        canFollowMoreInboxAndNotify("list")
      } else {
        canFollowMoreInboxAndNotify("feed")
      }
      let isFollowed = false
      if (options?.id) {
        isFollowed = !!getSubscriptionByFeedId(options.id)
      }

      present({
        title: `${isFollowed ? `${t("common:words.edit")} ` : ""}${options?.isList ? t("words.lists") : t("words.feeds")}`,
        content: ({ dismiss }) => {
          const onSuccess = () => {
            options?.onSuccess?.()
            dismiss()
          }
          return options?.isList ? (
            <ListForm
              asWidget
              id={options?.id}
              defaultValues={options?.defaultValues as ListFormDataValuesType}
              onSuccess={onSuccess}
            />
          ) : (
            <FeedForm
              asWidget
              id={options?.id}
              url={options?.url}
              defaultValues={options?.defaultValues as FeedFormDataValuesType}
              onSuccess={onSuccess}
            />
          )
        },
      })
    },
    [canFollowMoreInboxAndNotify, present],
  )
}
