import { useAuthQuery } from "~/hooks/common"
import { defineQuery } from "~/lib/defineQuery"
import { inboxActions } from "~/store/inbox"

export const inboxes = {
  byId: ({ id }: { id: string }) =>
    defineQuery(["lists", id], async () => inboxActions.fetchInboxById(id), {
      rootKey: ["lists"],
    }),
}

export const useInbox = ({ id }: { id: string }) =>
  useAuthQuery(inboxes.byId({ id }), {
    enabled: !!id,
  })
