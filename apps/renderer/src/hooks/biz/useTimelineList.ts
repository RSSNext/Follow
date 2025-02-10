import { useAllInboxes, useAllLists } from "~/store/subscription/hooks"

export const useTimelineList = () => {
  const lists = useAllLists()
  const inboxes = useAllInboxes()

  const views = [0, 1, 2, 3].map((view) => `view-${view}`)

  const listsIds = lists.map((list) => `list-${list.listId}`)
  const inboxesIds = inboxes.map((inbox) => `inbox-${inbox.inboxId}`)

  return {
    views,
    lists: listsIds,
    inboxes: inboxesIds,

    all: [...views, ...listsIds, ...inboxesIds],
  }
}
