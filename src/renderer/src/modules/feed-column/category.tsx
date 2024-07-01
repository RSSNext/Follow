import {
  Collapsible,
  CollapsibleTrigger,
} from "@renderer/components/ui/collapsible"
import { useNavigateEntry } from "@renderer/hooks/biz/useNavigateEntry"
import { useRouteParamsSelector } from "@renderer/hooks/biz/useRouteParams"
import { levels } from "@renderer/lib/constants"
import { stopPropagation } from "@renderer/lib/dom"
import { showNativeMenu } from "@renderer/lib/native-menu"
import { cn } from "@renderer/lib/utils"
import type { FeedListModel } from "@renderer/models"
import { useUnreadStore } from "@renderer/store"
import { AnimatePresence, m } from "framer-motion"
import { memo, useEffect, useState } from "react"

import { useModalStack } from "../../components/ui/modal/stacked/hooks"
import { CategoryRemoveDialogContent } from "./category-remove-dialog"
import { CategoryRenameContent } from "./category-rename-dialog"
import { FeedItem } from "./item"

interface FeedCategoryProps {
  data: FeedListModel["list"][number]
  view?: number
  expansion: boolean
  showUnreadCount?: boolean
}

function FeedCategoryImpl({
  data,
  view,
  expansion,
  showUnreadCount = true,
}: FeedCategoryProps) {
  const [open, setOpen] = useState(!data.name)

  const feedIdList = data.list.map((feed) => feed.feedId)

  useEffect(() => {
    if (data.name) {
      setOpen(expansion)
    }
  }, [expansion])

  const navigate = useNavigateEntry()

  const setCategoryActive = () => {
    if (view !== undefined) {
      navigate({
        entryId: null,
        // TODO joint feedId is too long, need to be optimized
        feedId: data.list.map((feed) => feed.feedId).join(","),
        level: levels.folder,
        view,
        category: data.name,
      })
    }
  }

  const unread = useUnreadStore((state) =>
    data.list.reduce((acc, cur) => (state.data[cur.feedId] || 0) + acc, 0),
  )

  const sortByUnreadFeedList = useUnreadStore((state) =>
    data.list.sort(
      (a, b) => (state.data[b.feedId] || 0) - (state.data[a.feedId] || 0),
    ),
  )

  const isActive = useRouteParamsSelector(
    (routerParams) =>
      routerParams?.level === levels.folder &&
      (routerParams.feedId === data.list.map((feed) => feed.feedId).join(",") || data.name === routerParams?.category),
  )
  const { present } = useModalStack()

  return (
    <Collapsible
      open={open}
      onOpenChange={(o) => setOpen(o)}
      onClick={(e) => e.stopPropagation()}
    >
      {!!data.name && (
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
                          feedIdList={feedIdList}
                          category={data.name}
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
                      title: `Delete category ${data.name}?`,
                      content: () => (
                        <CategoryRemoveDialogContent feedIdList={feedIdList} />
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
            <span className={cn("truncate", !showUnreadCount && (unread ? "font-bold" : "font-medium opacity-70"))}>
              {data.name}
            </span>
          </div>
          {!!unread && showUnreadCount && (
            <div className="ml-2 text-xs text-zinc-500 dark:text-neutral-400">{unread}</div>
          )}
        </div>
      )}
      <AnimatePresence>
        {open && (
          <m.div
            className="overflow-hidden"
            initial={!!data.name && {
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
            {sortByUnreadFeedList.map((feed) => (
              <FeedItem
                showUnreadCount={showUnreadCount}
                key={feed.feedId}
                subscription={feed}
                view={view}
                className={data.name ? "pl-6" : "pl-2.5"}
              />
            ))}
          </m.div>
        )}
      </AnimatePresence>
    </Collapsible>
  )
}

export const FeedCategory = memo(FeedCategoryImpl)
