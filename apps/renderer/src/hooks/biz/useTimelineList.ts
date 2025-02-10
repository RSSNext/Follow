import { useMemo } from "react"

import { useAllInboxes, useAllLists } from "~/store/subscription/hooks"

const views = [0, 1, 2, 3].map((view) => `view-${view}`)
export const useTimelineList = () => {
  const lists = useAllLists()
  const inboxes = useAllInboxes()

  const listsIds = useMemo(() => lists.map((list) => `list-${list.listId}`), [lists])
  const inboxesIds = useMemo(() => inboxes.map((inbox) => `inbox-${inbox.inboxId}`), [inboxes])

  return {
    views,
    lists: listsIds,
    inboxes: inboxesIds,

    all: useMemo(() => [...views, ...inboxesIds, ...listsIds], [listsIds, inboxesIds]),
  }
}
