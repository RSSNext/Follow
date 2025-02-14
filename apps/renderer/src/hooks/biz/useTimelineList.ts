import { useMemo } from "react"

import { useAllInboxes, useAllLists, useViewWithSubscription } from "~/store/subscription/hooks"

export const useTimelineList = () => {
  const lists = useAllLists()
  const inboxes = useAllInboxes()
  const views = useViewWithSubscription()

  const listsIds = useMemo(() => lists.map((list) => `list-${list.listId}`), [lists])
  const inboxesIds = useMemo(() => inboxes.map((inbox) => `inbox-${inbox.inboxId}`), [inboxes])
  const viewsIds = useMemo(() => views.map((view) => `view-${view}`), [views])

  return {
    views: viewsIds,
    lists: listsIds,
    inboxes: inboxesIds,

    all: useMemo(() => [...viewsIds, ...inboxesIds, ...listsIds], [viewsIds, listsIds, inboxesIds]),
  }
}
