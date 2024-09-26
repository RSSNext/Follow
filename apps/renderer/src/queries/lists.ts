import { defineQuery } from "~/lib/defineQuery"
import { listActions } from "~/store/list"

export const lists = {
  list: () =>
    defineQuery(["lists"], async () => listActions.fetchOwnedLists(), {
      rootKey: ["lists"],
    }),
}
