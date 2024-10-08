import { t } from "i18next"
import { useCallback } from "react"

import { useModalStack } from "~/components/ui/modal/stacked"
import { FeedForm } from "~/modules/discover/feed-form"
import { ListForm } from "~/modules/discover/list-form"

export const useFollow = () => {
  const { present } = useModalStack()

  return useCallback(
    (options?: { isList: boolean; id?: string; url?: string }) => {
      present({
        title: options?.isList
          ? t("sidebar.feed_actions.edit_list")
          : t("sidebar.feed_actions.edit_feed"),
        content: ({ dismiss }) =>
          options?.isList ? (
            <ListForm asWidget id={options?.id} onSuccess={dismiss} />
          ) : (
            <FeedForm asWidget id={options?.id} url={options?.url} onSuccess={dismiss} />
          ),
      })
    },
    [present],
  )
}
