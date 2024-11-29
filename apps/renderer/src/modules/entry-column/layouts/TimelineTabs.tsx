import { Tabs, TabsList, TabsTrigger } from "@follow/components/ui/tabs/index.jsx"
import { useCallback } from "react"

import { useNavigateEntry } from "~/hooks/biz/useNavigateEntry"
import { useRouteParams } from "~/hooks/biz/useRouteParams"
import { InboxItem, ListItem } from "~/modules/feed-column/item"
import { useSubscriptionStore } from "~/store/subscription"

export const TimelineTabs = () => {
  const routerParams = useRouteParams()
  const { view, listId, inboxId, folderName } = routerParams

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
  const categoriesData = useSubscriptionStore(
    useCallback(
      (state) => {
        const categoryNames = new Set<string>()
        for (const subId of state.feedIdByView[view]) {
          const sub = state.data[subId]
          if (sub.category) {
            categoryNames.add(sub.category)
          }
        }
        return Array.from(categoryNames)
      },
      [view],
    ),
  )
  const hasData = listsData.length > 0 || inboxData.length > 0

  const timeline = listId || inboxId || folderName || ""

  const navigate = useNavigateEntry()
  if (!hasData) return null

  return (
    <Tabs
      className="-ml-6 -mr-4 mt-2 flex overflow-x-auto overflow-y-hidden pl-3 scrollbar-none"
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
      <TabsList className="justify-start border-b-0 [&_span]:text-xs">
        <TabsTrigger variant={"rounded"} className="p-0" value="">
          <span>Yours</span>
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
        {categoriesData.map((s) => (
          <TabsTrigger
            variant={"rounded"}
            key={s}
            value={s}
            onClick={() => {
              navigate({
                folderName: s,
              })
            }}
          >
            <span className="flex h-5 items-center gap-1">
              <i className="i-mgc-folder-open-cute-re" />
              {s}
            </span>
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
