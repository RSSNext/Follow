import { useUISettingKey } from "@renderer/atoms/settings/ui"
import { ScrollArea } from "@renderer/components/ui/scroll-area"
import { FEED_COLLECTION_LIST, views } from "@renderer/constants"
import { useNavigateEntry } from "@renderer/hooks/biz/useNavigateEntry"
import { useRouteFeedId } from "@renderer/hooks/biz/useRouteParams"
import { useAuthQuery } from "@renderer/hooks/common"
import { stopPropagation } from "@renderer/lib/dom"
import type { FeedViewType } from "@renderer/lib/enum"
import { cn } from "@renderer/lib/utils"
import { Queries } from "@renderer/queries"
import { useSubscriptionByView } from "@renderer/store/subscription"
import { useFeedUnreadStore } from "@renderer/store/unread"
import { useMemo, useState } from "react"
import { Link } from "react-router-dom"

import { FeedCategory } from "./category"
import { UnreadNumber } from "./unread-number"

const useGroupedData = (view: FeedViewType) => {
  const { data: remoteData } = useAuthQuery(Queries.subscription.byView(view))

  const data = useSubscriptionByView(view) || remoteData

  return useMemo(() => {
    if (!data || data.length === 0) return {}

    const groupFolder = {} as Record<string, string[]>

    for (const subscription of data) {
      const category = subscription.category || subscription.defaultCategory
      if (category) {
        if (!groupFolder[category]) {
          groupFolder[category] = []
        }
        groupFolder[category].push(subscription.feedId)
      }
    }

    return groupFolder
  }, [data])
}

const useUpdateUnreadCount = () => {
  useAuthQuery(Queries.subscription.unreadAll(), {
    refetchInterval: false,
  })
  // const isPageVisible = usePageVisibility()

  // useAccurateInterval(
  //   () => {
  //     if (!isPageVisible) {
  //       refetch()
  //     }
  //   },
  //   {
  //     enable: !isPageVisible,
  //     delay:
  //       // 10s
  //       10_000,
  //   },
  // )
}

export function FeedList({
  className,
  view,
}: {
  className?: string
  view: number
}) {
  const [expansion, setExpansion] = useState(false)
  const data = useGroupedData(view)

  useUpdateUnreadCount()

  const totalUnread = useFeedUnreadStore((state) => {
    let unread = 0

    for (const category in data) {
      for (const feedId of data[category]) {
        unread += state.data[feedId] || 0
      }
    }
    return unread
  })

  const sortedByUnread = useFeedUnreadStore((state) => {
    const sortedList = [] as [string, string[]][]
    const folderUnread = {} as Record<string, number>
    // Calc total unread count for each folder
    for (const category in data) {
      folderUnread[category] = data[category].reduce(
        (acc, cur) => (state.data[cur] || 0) + acc,
        0,
      )
    }

    // Sort by unread count
    Object.keys(folderUnread)
      .sort((a, b) => folderUnread[b] - folderUnread[a])
      .forEach((key) => {
        sortedList.push([key, data[key]])
      })

    return sortedList
  })

  const hasData = Object.keys(data).length > 0

  const feedId = useRouteFeedId()
  const navigate = useNavigateEntry()
  const showUnreadCount = useUISettingKey("sidebarShowUnreadCount")

  return (
    <div className={cn(className, "font-medium")}>
      <div
        onClick={stopPropagation}
        className="mx-3 mb-2 flex items-center justify-between px-2.5 py-1"
      >
        <div
          className="font-bold"
          onClick={(e) => {
            e.stopPropagation()
            if (view !== undefined) {
              navigate({
                entryId: null,
                feedId: null,
                view,
              })
            }
          }}
        >
          {view !== undefined && views[view].name}
        </div>
        <div className="ml-2 flex items-center gap-3 text-sm text-theme-vibrancyFg">
          {expansion ? (
            <i
              className="i-mgc-list-collapse-cute-fi"
              onClick={() => setExpansion(false)}
            />
          ) : (
            <i
              className="i-mgc-list-expansion-cute-fi"
              onClick={() => setExpansion(true)}
            />
          )}
          <UnreadNumber unread={totalUnread} className="text-xs !text-inherit" />
        </div>
      </div>
      <ScrollArea.ScrollArea
        mask={false}
        flex
        viewportClassName="!px-3"
        rootClassName="h-full"
      >
        <div
          className={cn(
            "flex h-8 w-full shrink-0 items-center rounded-md px-2.5 transition-colors",
            feedId === FEED_COLLECTION_LIST && "bg-native-active",
          )}
          onClick={(e) => {
            e.stopPropagation()
            if (view !== undefined) {
              navigate({
                entryId: null,
                feedId: FEED_COLLECTION_LIST,
                view,
              })
            }
          }}
        >
          <i className="i-mgc-star-cute-fi mr-2 text-orange-500" />
          Starred
        </div>
        {hasData ? (
          sortedByUnread?.map(([category, ids]) => (
            <FeedCategory
              showUnreadCount={showUnreadCount}
              key={category}
              data={ids}
              view={view}
              expansion={expansion}
            />
          ))
        ) : (
          <div className="flex h-full flex-1 items-center font-normal text-zinc-500">
            <Link
              to="/discover"
              className="absolute inset-0 mt-[-3.75rem] flex h-full flex-1 cursor-default flex-col items-center justify-center gap-2"
              onClick={stopPropagation}
            >
              <i className="i-mgc-add-cute-re text-3xl" />
              <span className="text-base">Add some feeds</span>
            </Link>
          </div>
        )}
      </ScrollArea.ScrollArea>
    </div>
  )
}
