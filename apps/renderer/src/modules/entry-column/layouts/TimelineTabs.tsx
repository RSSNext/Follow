import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { useNavigateEntry } from "~/hooks/biz/useNavigateEntry"
import { useRouteParams } from "~/hooks/biz/useRouteParams"
import { InboxItem, ListItem } from "~/modules/feed-column/item"
import { useSubscriptionStore } from "~/store/subscription"

export const TimelineTabs = () => {
  const routerParams = useRouteParams()
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

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.currentTarget.scrollLeft += e.deltaY
  }

  return (
    <Tabs
      className="-ml-3 -mr-4 mt-1 flex overflow-x-auto scrollbar-none"
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
      <TabsList className="h-10 justify-start overflow-hidden border-b-0" onWheel={handleWheel}>
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
