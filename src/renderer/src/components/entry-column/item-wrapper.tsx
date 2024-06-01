import { useEntryActions } from "@renderer/hooks/useEntryActions"
import { showNativeMenu } from "@renderer/lib/native-menu"
import { cn } from "@renderer/lib/utils"
import { apiClient } from "@renderer/queries/api-fetch"
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
    // TODO  出错回退
  })

  // NOTE: prevent 0 height element, react virtuoso will not stop render any more
  if (!entry) return <ReactVirtuosoItemPlaceholder />

  return (
    <div
      key={entry.entries.id}
      className={cn(
        "rounded-md transition-colors",
        activeEntry === entry.entries.id && "bg-native-active/40",
        entry.read ? "text-zinc-600 opacity-85" : "text-zinc-900 dark:text-white/90",
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
  )
}
