import { useAuthQuery } from "~/hooks/common"
import { defineQuery } from "~/lib/defineQuery"
import { listActions } from "~/store/list"

export const lists = {
  list: () =>
    defineQuery(["lists"], async () => listActions.fetchOwnedLists(), {
      rootKey: ["lists"],
    }),
  byId: ({ id }: { id: string }) =>
    defineQuery(["lists", id], async () => listActions.fetchListById(id), {
      rootKey: ["lists"],
    }),
}

export const useList = ({ id }: { id?: string }) =>
  useAuthQuery(lists.byId({ id: id! }), {
    enabled: !!id,
  })
