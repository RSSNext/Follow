import {
  Collapsible,
  CollapsibleTrigger,
} from "@renderer/components/ui/collapsible"
import { useNavigateEntry } from "@renderer/hooks/biz/useNavigateEntry"
import { useRouteParamsSelector } from "@renderer/hooks/biz/useRouteParams"
import { ROUTE_FEED_IN_FOLDER } from "@renderer/lib/constants"
import { stopPropagation } from "@renderer/lib/dom"
import { showNativeMenu } from "@renderer/lib/native-menu"
import { cn } from "@renderer/lib/utils"
import { useSubscriptionByFeedId } from "@renderer/store/subscription"
import { useFeedUnreadStore } from "@renderer/store/unread"
import { AnimatePresence, m } from "framer-motion"
import { memo, useEffect, useState } from "react"

import { useModalStack } from "../../components/ui/modal/stacked/hooks"
import { CategoryRemoveDialogContent } from "./category-remove-dialog"
import { CategoryRenameContent } from "./category-rename-dialog"
import { FeedItem } from "./item"

type FeedId = string
interface FeedCategoryProps {
  data: FeedId[]
  view?: number
  expansion: boolean
  showUnreadCount?: boolean
}

function FeedCategoryImpl({
  data: ids,
  view,
  expansion,
  showUnreadCount = true,
}: FeedCategoryProps) {
  const sortByUnreadFeedList = useFeedUnreadStore((state) =>
    ids.sort((a, b) => (state.data[b] || 0) - (state.data[a] || 0)),
  )

  const navigate = useNavigateEntry()

  const subscription = useSubscriptionByFeedId(ids[0])
  const folderName = subscription?.category || subscription.defaultCategory

  const showCollapse = sortByUnreadFeedList.length > 1 || subscription?.category
  const [open, setOpen] = useState(!showCollapse)
  useEffect(() => {
    if (showCollapse) {
      setOpen(expansion)
    }
  }, [expansion])

  const setCategoryActive = () => {
    if (view !== undefined) {
      navigate({
        entryId: null,
        // TODO joint feedId is too long, need to be optimized
        feedId: `${ROUTE_FEED_IN_FOLDER}${folderName}`,
        view,
      })
    }
  }

  const unread = useFeedUnreadStore((state) =>
    ids.reduce((acc, feedId) => (state.data[feedId] || 0) + acc, 0),
  )

  const isActive = useRouteParamsSelector(
    (routerParams) =>
      routerParams.feedId === `${ROUTE_FEED_IN_FOLDER}${folderName}`,
  )
  const { present } = useModalStack()

  return (
    <Collapsible
      open={open}
      onOpenChange={(o) => setOpen(o)}
      onClick={(e) => e.stopPropagation()}
    >
      {!!showCollapse && (
        <div
          className={cn(
            "flex w-full items-center justify-between rounded-md px-2.5 transition-colors",
            isActive && "bg-native-active",
          )}
          onClick={(e) => {
            e.stopPropagation()
            setCategoryActive()
          }}
          onContextMenu={(e) => {
            showNativeMenu(
              [
                {
                  type: "text",
                  label: "Rename Category",
                  click: () => {
                    present({
                      title: "Rename Category",
                      content: ({ dismiss }) => (
                        <CategoryRenameContent
                          feedIdList={ids}
                          category={folderName || ""}
                          view={view}
                          onSuccess={dismiss}
                        />
                      ),
                    })
                  },
                },
                {
                  type: "text",
                  label: "Delete Category",

                  click: async () => {
                    present({
                      title: `Delete category ${folderName}?`,
                      content: () => (
                        <CategoryRemoveDialogContent feedIdList={ids} />
                      ),
                    })
                  },
                },
              ],
              e,
            )
          }}
        >
          <div className="flex w-full min-w-0 items-center">
            <CollapsibleTrigger
              onClick={stopPropagation}
              className={cn(
                "flex h-8 items-center [&_.i-mgc-right-cute-fi]:data-[state=open]:rotate-90",
              )}
              tabIndex={-1}
            >
              <i className="i-mgc-right-cute-fi mr-2 transition-transform" />
            </CollapsibleTrigger>
            <span
              className={cn(
                "truncate",
                !showUnreadCount &&
                (unread ? "font-bold" : "font-medium opacity-70"),
              )}
            >
              {folderName}
            </span>
          </div>
          {!!unread && showUnreadCount && (
            <div className="ml-2 text-xs text-zinc-500 dark:text-neutral-400">
              {unread}
            </div>
          )}
        </div>
      )}
      <AnimatePresence>
        {open && (
          <m.div
            className="overflow-hidden"
            initial={!!showCollapse && {
              height: 0,
              opacity: 0.01,
            }}
            animate={{
              height: "auto",
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0.01,
            }}
          >
            {sortByUnreadFeedList.map((feedId) => (
              <FeedItem
                showUnreadCount={showUnreadCount}
                key={feedId}
                feedId={feedId}
                view={view}
                className={showCollapse ? "pl-6" : "pl-2.5"}
              />
            ))}
          </m.div>
        )}
      </AnimatePresence>
    </Collapsible>
  )
}

export const FeedCategory = memo(FeedCategoryImpl)
