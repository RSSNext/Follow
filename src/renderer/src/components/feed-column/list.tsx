import { useSubscriptions } from "@renderer/lib/queries/subscriptions"
import {
  Collapsible,
  CollapsibleTrigger,
} from "@renderer/components/ui/collapsible"
import { m, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { levels, views } from "@renderer/lib/constants"
import { ActivedList, SubscriptionResponse } from "@renderer/lib/types"
import { cn } from "@renderer/lib/utils"
import { Response as SubscriptionsResponse } from "@renderer/lib/queries/subscriptions"
import { FeedContextMenu } from "./context-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  TooltipPortal,
} from "@renderer/components/ui/tooltip"
import { FeedIcon } from "@renderer/components/feed-icon"
import dayjs from "@renderer/lib/dayjs"

export function FeedList({
  className,
  view,
  activedList,
  setActivedList,
  hideTitle,
}: {
  className?: string
  view?: number
  activedList?: ActivedList
  setActivedList?: (value: ActivedList) => void
  hideTitle?: boolean
}) {
  const subscriptions = useSubscriptions(view)
  const [expansion, setExpansion] = useState(false)

  return (
    <div className={className}>
      {!hideTitle && (
        <div
          className={cn("flex items-center justify-between mb-2 px-2.5 py-1")}
        >
          <div className="font-bold">
            {view !== undefined && views[view].name}
          </div>
          <div className="text-sm text-zinc-500 ml-2 flex items-center gap-3">
            {expansion ? (
              <i
                className="i-mingcute-list-collapse-fill cursor-pointer"
                onClick={() => setExpansion(false)}
              />
            ) : (
              <i
                className="i-mingcute-list-expansion-fill cursor-pointer"
                onClick={() => setExpansion(true)}
              />
            )}
            <span>{subscriptions.data?.unread}</span>
          </div>
        </div>
      )}
      {subscriptions.data?.list.map((category) => (
        <FeedCategory
          key={category.name}
          data={category}
          activedList={activedList}
          setActivedList={setActivedList}
          view={view}
          expansion={expansion}
        />
      ))}
    </div>
  )
}

function FeedCategory({
  data,
  activedList,
  setActivedList,
  view,
  expansion,
}: {
  data: SubscriptionsResponse["list"][number]
  activedList?: ActivedList
  setActivedList?: (value: ActivedList) => void
  view?: number
  expansion: boolean
}) {
  const [open, setOpen] = useState(!data.name)

  const setFeedActive = (feed: SubscriptionResponse[number]) => {
    view !== undefined &&
      setActivedList?.({
        level: levels.feed,
        id: feed.feedId,
        name: feed.feeds.title || "",
        view,
      })
  }

  useEffect(() => {
    setOpen(expansion)
  }, [expansion])

  return (
    <Collapsible
      open={open}
      onOpenChange={(o) => setOpen(o)}
      onClick={(e) => e.stopPropagation()}
    >
      {!!data.name && (
        <div
          className={cn(
            "flex items-center justify-between font-medium text-sm leading-loose px-2.5 py-[2px] rounded-md w-full cursor-pointer transition-colors",
            activedList?.level === levels.folder &&
              activedList.name === data.name &&
              "bg-[#C9C9C7]",
          )}
          onClick={(e) => {
            e.stopPropagation()
            view !== undefined &&
              setActivedList?.({
                level: levels.folder,
                id: data.list.map((feed) => feed.feedId).join(","),
                name: data.name,
                view,
              })
          }}
        >
          <div className="flex items-center min-w-0 w-full">
            <CollapsibleTrigger
              className={cn(
                "flex items-center h-7 [&_.i-mingcute-right-fill]:data-[state=open]:rotate-90",
                !setActivedList && "flex-1",
              )}
            >
              <i className="i-mingcute-right-fill mr-2 transition-transform" />
              {!setActivedList && <span className="truncate">{data.name}</span>}
            </CollapsibleTrigger>
            {setActivedList && <span className="truncate">{data.name}</span>}
          </div>
          {!!data.unread && (
            <div className="text-xs text-zinc-500 ml-2">{data.unread}</div>
          )}
        </div>
      )}
      <AnimatePresence>
        {open && (
          <m.div
            className="overflow-hidden"
            initial={
              !!data.name && {
                height: 0,
                opacity: 0.01,
              }
            }
            animate={{
              height: "auto",
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0.01,
            }}
          >
            {data.list.map((feed) => (
              <FeedContextMenu
                feed={feed}
                key={feed.feedId}
                onOpenChange={() => setFeedActive(feed)}
              >
                <div
                  className={cn(
                    "flex items-center justify-between text-sm font-medium leading-loose w-full pr-2.5 py-[2px] rounded-md cursor-pointer",
                    activedList?.level === levels.feed &&
                      activedList.id === feed.feedId &&
                      "bg-[#C9C9C7]",
                    !!data.name ? "pl-6" : "pl-2.5",
                  )}
                  onClick={(e) => {
                    e.stopPropagation()
                    setFeedActive(feed)
                  }}
                >
                  <div
                    className={cn(
                      "flex items-center min-w-0",
                      feed.feeds.errorAt && "text-red-900",
                    )}
                  >
                    <FeedIcon feed={feed.feeds} className="w-4 h-4" />
                    <div className="truncate">{feed.feeds.title}</div>
                    {feed.feeds.errorAt && (
                      <TooltipProvider delayDuration={300}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <i className="i-mingcute-wifi-off-line shrink-0 ml-1 text-base" />
                          </TooltipTrigger>
                          <TooltipPortal>
                            <TooltipContent>
                              Error since{" "}
                              {dayjs
                                .duration(
                                  dayjs(feed.feeds.errorAt).diff(
                                    dayjs(),
                                    "minute",
                                  ),
                                  "minute",
                                )
                                .humanize(true)}
                            </TooltipContent>
                          </TooltipPortal>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                    {feed.isPrivate && (
                      <TooltipProvider delayDuration={300}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <i className="i-mingcute-eye-close-line shrink-0 ml-1 text-base" />
                          </TooltipTrigger>
                          <TooltipPortal>
                            <TooltipContent>
                              Not publicly visible on your profile page
                            </TooltipContent>
                          </TooltipPortal>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                  {!!feed.unread && (
                    <div className="text-xs text-zinc-500 ml-2">
                      {feed.unread}
                    </div>
                  )}
                </div>
              </FeedContextMenu>
            ))}
          </m.div>
        )}
      </AnimatePresence>
    </Collapsible>
  )
}
