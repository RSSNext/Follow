import {
  Collapsible,
  CollapsibleTrigger,
} from "@renderer/components/ui/collapsible"
import { LoadingCircle } from "@renderer/components/ui/loading"
import { ROUTE_FEED_IN_FOLDER, views } from "@renderer/constants"
import { useNavigateEntry } from "@renderer/hooks/biz/useNavigateEntry"
import {
  getRouteParams,
  useRouteParamsSelector,
} from "@renderer/hooks/biz/useRouteParams"
import { stopPropagation } from "@renderer/lib/dom"
import type { FeedViewType } from "@renderer/lib/enum"
import { showNativeMenu } from "@renderer/lib/native-menu"
import { cn } from "@renderer/lib/utils"
import {
  subscriptionActions,
  useSubscriptionByFeedId,
} from "@renderer/store/subscription"
import { useFeedUnreadStore } from "@renderer/store/unread"
import { useMutation } from "@tanstack/react-query"
import { AnimatePresence, m } from "framer-motion"
import { memo, useEffect, useRef, useState } from "react"

import { useModalStack } from "../../components/ui/modal/stacked/hooks"
import { CategoryRemoveDialogContent } from "./category-remove-dialog"
import { CategoryRenameContent } from "./category-rename-dialog"
import { FeedItem } from "./item"
import { UnreadNumber } from "./unread-number"

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

  const showCollapse =
    sortByUnreadFeedList.length > 1 || subscription?.category
  const [open, setOpen] = useState(!showCollapse)

  const shouldOpen = useRouteParamsSelector(
    (s) => typeof s.feedId === "string" && ids.includes(s.feedId),
  )

  const itemsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (shouldOpen) {
      setOpen(true)

      const $items = itemsRef.current

      if (!$items) return
      $items
        .querySelector(`[data-feed-id="${getRouteParams().feedId}"]`)
        ?.scrollIntoView({
          block: "center",
          behavior: "smooth",
        })
    }
  }, [shouldOpen])
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

  const { mutateAsync: changeCategoryView, isPending: isChangePending } =
    useMutation({
      mutationKey: ["changeCategoryView", folderName, view],
      mutationFn: async (nextView: FeedViewType) => {
        if (!folderName) return
        if (typeof view !== "number") return
        return subscriptionActions.changeCategoryView(
          folderName,
          view,
          nextView,
        )
      },
    })

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
                  enabled: !!(folderName && typeof view === "number"),
                  label: "Change to other view",
                  submenu: views
                    .filter((v) => v.view !== view)
                    .map((v) => ({
                      label: v.name,
                      enabled: true,
                      type: "text",
                      shortcut: (v.view + 1).toString(),
                      icon: v.icon,
                      click() {
                        return changeCategoryView(v.view)
                      },
                    })),
                },
                {
                  type: "text",
                  label: "Rename category",
                  click: () => {
                    present({
                      title: "Rename Category",
                      clickOutsideToDismiss: true,
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
                  label: "Delete category",

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
              {isChangePending ? (
                <LoadingCircle size="small" className="mr-2" />
              ) : (
                <i className="i-mgc-right-cute-fi mr-2 transition-transform" />
              )}
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
          <UnreadNumber unread={unread} className="ml-2" />
        </div>
      )}
      <AnimatePresence>
        {open && (
          <m.div
            ref={itemsRef}
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
