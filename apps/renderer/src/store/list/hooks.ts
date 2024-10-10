import { useMutation } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"

import { apiClient } from "~/lib/api-fetch"
import type { FeedViewType } from "~/lib/enum"
import type { ListModel } from "~/models"
import { Queries } from "~/queries"

import { listActions, useListStore } from "./store"

export const useListById = (listId: Nullable<string>): ListModel | null =>
  useListStore((state) => (listId ? state.lists[listId] : null))

export const useListByView = (view: FeedViewType) => {
  return useListStore((state) => Object.values(state.lists).filter((list) => list.view === view))
}

export const useDeleteFeedList = (options?: { onSuccess: () => void; onError: () => void }) => {
  const { t } = useTranslation("settings")
  return useMutation({
    mutationFn: async (payload: { listId: string }) => {
      listActions.deleteList(payload.listId)
      await apiClient.lists.$delete({
        json: {
          listId: payload.listId,
        },
      })
    },
    onSuccess: () => {
      toast.success(t("lists.delete.success"))
      Queries.lists.list().invalidate()
      options?.onSuccess?.()
    },
    async onError() {
      toast.error(t("lists.delete.error"))
      options?.onError?.()
    },
  })
}
