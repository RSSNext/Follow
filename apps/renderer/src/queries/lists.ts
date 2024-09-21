import { defineQuery } from "~/lib/defineQuery"
import { feedActions } from "~/store/feed"

export const lists = {
  list: () =>
    defineQuery(["lists"], async () => feedActions.fetchOwnedLists(), {
      rootKey: ["lists"],
    }),
}
