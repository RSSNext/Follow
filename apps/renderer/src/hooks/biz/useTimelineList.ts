import { useAllInboxes, useAllLists } from "~/store/subscription/hooks"

export const useTimelineList = () => {
  const lists = useAllLists()
  const inboxes = useAllInboxes()

  return [
    ...[0, 1, 2, 3].map((view) => `view-${view}`),
    ...inboxes.map((inbox) => `inbox-${inbox.inboxId}`),
    ...lists.map((list) => `list-${list.listId}`),
  ]
}
