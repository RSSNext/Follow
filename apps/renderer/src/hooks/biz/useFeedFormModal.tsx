import { DEEPLINK_SCHEME } from "@follow/shared/constants"
import { useCallback } from "react"

import { useWhoami } from "~/atoms/user"
import { useModalStack } from "~/components/ui/modal"
import { FeedForm } from "~/modules/discover/feed-form"

import { useI18n } from "../common"

export const usePresentFeedFormModal = () => {
  const { present } = useModalStack()
  const me = useWhoami()
  const t = useI18n()
  return useCallback(
    (
      params:
        | {
            feedId: string
          }
        | {
            listId: string
          },
    ) => {
      if (me) {
        const isList = !!("listId" in params)
        present({
          title: isList ? t("sidebar.feed_actions.edit_list") : t("sidebar.feed_actions.edit_feed"),
          content: ({ dismiss }) => (
            <FeedForm
              asWidget
              id={isList ? params.listId : params.feedId}
              isList={isList}
              onSuccess={dismiss}
            />
          ),
        })
      } else {
        window.location.href = `${DEEPLINK_SCHEME}add?id=${"feedId" in params ? params.feedId : params.listId}`
      }
    },
    [me, present, t],
  )
}
