import {
  Collapsible,
  CollapsibleTrigger,
} from "@renderer/components/ui/collapsible"
import { Dialog } from "@renderer/components/ui/dialog"
import { useMainLayoutContext } from "@renderer/contexts/outlet/main-layout"
import { client } from "@renderer/lib/client"
import { levels } from "@renderer/lib/constants"
import { showNativeMenu } from "@renderer/lib/native-menu"
import { apiFetch } from "@renderer/lib/queries/api-fetch"
import { Response as SubscriptionsResponse } from "@renderer/lib/queries/subscriptions"
import { cn } from "@renderer/lib/utils"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AnimatePresence, m } from "framer-motion"
import { useEffect, useState } from "react"
import { CategoryRenameDialog } from "./category-rename-dialog"
import { FeedItem } from "./item"

export function FeedCategory({
  data,
  view,
  expansion,
}: {
  data: SubscriptionsResponse["list"][number]
  view?: number
  expansion: boolean
}) {
  const { activeList, setActiveList } = useMainLayoutContext()

  const [open, setOpen] = useState(!data.name)
  const [dialogOpen, setDialogOpen] = useState(false)

  const queryClient = useQueryClient()
  const feedIdList = data.list.map((feed) => feed.feedId)
  const deleteMutation = useMutation({
    mutationFn: async () =>
      apiFetch("/categories", {
        method: "DELETE",
        body: {
          feedIdList,
          deleteSubscriptions: false,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["subscriptions", view],
      })
    },
  })

  useEffect(() => {
    if (data.name) {
      setOpen(expansion)
    }
  }, [expansion])

  const setCategoryActive = () => {
    view !== undefined &&
    setActiveList?.({
      level: levels.folder,
      id: data.list.map((feed) => feed.feedId).join(","),
      name: data.name,
      view,
    })
  }

  return (
    <Collapsible
      open={open}
      onOpenChange={(o) => setOpen(o)}
      onClick={(e) => e.stopPropagation()}
    >
      {!!data.name && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <div
            className={cn(
              "flex w-full items-center justify-between rounded-md px-2.5 py-[2px] text-sm font-medium leading-loose transition-colors",
              activeList?.level === levels.folder &&
              activeList.name === data.name &&
              "bg-native-active",
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
                    click: () => setDialogOpen(true),
                  },
                  {
                    type: "text",
                    label: "Delete Category",
                    click: async () => {
                      if (
                        await client?.showConfirmDialog({
                          title: `Delete Category ${data.name}?`,
                          message: `This operation will delete your category, but the feeds it contains will be retained and grouped by website.`,
                          options: {
                            buttons: ["Delete", "Cancel"],
                          },
                        })
                      ) {
                        deleteMutation.mutate()
                      }
                    },
                  },
                ],
                e,
              )
            }}
          >
            <div className="flex w-full min-w-0 items-center">
              <CollapsibleTrigger
                className={cn(
                  "flex h-7 items-center [&_.i-mingcute-right-fill]:data-[state=open]:rotate-90",
                  !setActiveList && "flex-1",
                )}
              >
                <i className="i-mingcute-right-fill mr-2 transition-transform" />
                {!setActiveList && (
                  <span className="truncate">{data.name}</span>
                )}
              </CollapsibleTrigger>
              {setActiveList && <span className="truncate">{data.name}</span>}
            </div>
            {!!data.unread && (
              <div className="ml-2 text-xs text-zinc-500">{data.unread}</div>
            )}
            <CategoryRenameDialog
              feedIdList={feedIdList}
              view={view}
              category={data.name}
              onSuccess={() => setDialogOpen(false)}
            />
          </div>
        </Dialog>
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
            {data.list.map((feed) => (
              <FeedItem
                key={feed.feedId}
                feed={feed}
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
