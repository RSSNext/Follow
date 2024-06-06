import { useEntryActions } from "@renderer/hooks/useEntryActions"
import { apiClient } from "@renderer/lib/api-fetch"
import { views } from "@renderer/lib/constants"
import { showNativeMenu } from "@renderer/lib/native-menu"
import { cn } from "@renderer/lib/utils"
import { feedActions, useFeedStore } from "@renderer/store"
import { entryActions, useEntry } from "@renderer/store/entry"
import { useMutation } from "@tanstack/react-query"

import { ReactVirtuosoItemPlaceholder } from "../ui/placeholder"

export function EntryItemWrapper({
  children,
  entryId,
  view,
}: {
  entryId: string
  children: React.ReactNode
  view?: number
}) {
  const entry = useEntry(entryId)
  const { items } = useEntryActions({
    view,
    entry,
  })

  const activeEntry = useFeedStore((state) => state.activeEntry)

  const read = useMutation({
    mutationFn: async () =>
      apiClient.reads.$post({
        json: {
          entryIds: [entry.entries.id],
        },
      }),
    onMutate: () => {
      entryActions.optimisticUpdate(entry.entries.id, {
        read: true,
      })
    },
    // TODO  fallback
  })

  // NOTE: prevent 0 height element, react virtuoso will not stop render any more
  if (!entry) return <ReactVirtuosoItemPlaceholder />

  return (
    <div className={cn(!views[view || 0].wideMode && "pb-3")}>
      <div
        className={cn(
          "rounded-md bg-background transition-colors",
          !views[view || 0].wideMode && activeEntry === entry.entries.id && "bg-theme-item-active",
          entry.read ? "text-zinc-500/90" : "text-zinc-900 dark:text-white/90",
        )}
        // ref={ref}
        onClick={(e) => {
          e.stopPropagation()
          feedActions.setActiveEntry(entry.entries.id)
          if (!entry.read) {
            read.mutate()
          }
        }}
        onDoubleClick={() =>
          entry.entries.url && window.open(entry.entries.url, "_blank")}
        onContextMenu={(e) => {
          e.preventDefault()
          showNativeMenu(
            items
              .filter((item) => !item.disabled)
              .map((item) => ({
                type: "text",
                label: item.name,
                click: item.onClick,
              })),
            e,
          )
        }}
      >
        {children}
      </div>
    </div>
  )
}
