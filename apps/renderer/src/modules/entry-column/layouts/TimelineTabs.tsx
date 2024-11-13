import { Tabs, TabsList, TabsTrigger } from "@follow/components/ui/tabs/index.jsx"
import { useCallback } from "react"

import { useNavigateEntry } from "~/hooks/biz/useNavigateEntry"
import { useRouteParams } from "~/hooks/biz/useRouteParams"
import { InboxItem, ListItem } from "~/modules/feed-column/item"
import { useSubscriptionStore } from "~/store/subscription"

export const TimelineTabs = () => {
  const routerParams = useRouteParams()
  const { view, listId, inboxId } = routerParams

  const listsData = useSubscriptionStore(
    useCallback(
      (state) => state.feedIdByView[view].map((id) => state.data[id]).filter((s) => "listId" in s),
      [view],
    ),
  )
  const inboxData = useSubscriptionStore(
    useCallback(
      (state) => state.feedIdByView[view].map((id) => state.data[id]).filter((s) => "inboxId" in s),
      [view],
    ),
  )
  const hasData = listsData.length > 0 || inboxData.length > 0

  const timeline = listId || inboxId || ""

  const navigate = useNavigateEntry()
  if (!hasData) return null

  return (
    <Tabs
      className="scrollbar-none -ml-3 -mr-4 mt-3 flex overflow-x-auto"
      value={timeline}
      onValueChange={(val) => {
        if (!val) {
          navigate({
            feedId: null,
            entryId: null,
            view,
          })
        }
      }}
    >
      <TabsList className="justify-start border-b-0">
        <TabsTrigger variant={"rounded"} className="p-0" value="">
          Yours
        </TabsTrigger>
        {listsData.map((s) => (
          <TabsTrigger variant={"rounded"} className="p-0" key={s.listId} value={s.listId!}>
            <ListItem
              listId={s.listId!}
              view={view}
              iconSize={16}
              className="h-5 !bg-transparent p-0"
            />
          </TabsTrigger>
        ))}
        {inboxData.map((s) => (
          <TabsTrigger variant={"rounded"} key={s.inboxId} value={s.inboxId!}>
            <InboxItem
              inboxId={s.inboxId!}
              view={view}
              iconSize={16}
              className="h-5 !bg-transparent p-0"
            />
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
