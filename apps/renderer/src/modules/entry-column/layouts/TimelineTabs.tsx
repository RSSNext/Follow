import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { useNavigateEntry } from "~/hooks/biz/useNavigateEntry"
import { useRouteParams } from "~/hooks/biz/useRouteParams"
import { InboxItem, ListItem } from "~/modules/feed-column/item"
import { useSubscriptionStore } from "~/store/subscription"
import * as React from "react"

export const TimelineTabs = () => {
  const routerParams = useRouteParams()
  const listRef = React.useRef<HTMLDivElement>(null)
  const { view, listId, inboxId } = routerParams

  const listsData = useSubscriptionStore((state) =>
    state.feedIdByView[view].map((id) => state.data[id]).filter((s) => "listId" in s),
  )
  const inboxData = useSubscriptionStore((state) =>
    state.feedIdByView[view].map((id) => state.data[id]).filter((s) => "inboxId" in s),
  )
  const hasData = listsData.length > 0 || inboxData.length > 0

  const timeline = listId || inboxId || ""

  const navigate = useNavigateEntry()
  if (!hasData) return null

  if (!listRef.current) return
  const list = listRef.current
  list.addEventListener("wheel", (e) => {
    e.preventDefault()
    list.scrollLeft += e.deltaY
  })
  
  return (
    <Tabs
      className="-ml-3 -mr-4 mt-1 overflow-x-auto scrollbar-none flex"
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
      <TabsList ref={listRef as any} className="h-10 border-b-0 overflow-hidden justify-start">
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