import { useEntryActions } from "@renderer/hooks/useEntryActions"
import { useUpdateEntry } from "@renderer/hooks/useUpdateEntry"
import { showNativeMenu } from "@renderer/lib/native-menu"
import type { EntriesResponse } from "@renderer/lib/types"
import { cn } from "@renderer/lib/utils"
import { apiFetch } from "@renderer/queries/api-fetch"
import { feedActions, useFeedStore } from "@renderer/store"
import { useMutation } from "@tanstack/react-query"
import { useHover } from "@use-gesture/react"
import { useRef } from "react"

export function EntryItemWrapper({
  entry,
  children,
  view,
}: {
  entry: EntriesResponse[number]
  children: React.ReactNode
  view?: number
}) {
  const { items } = useEntryActions({
    view,
    entry,
  })

  const activeEntry = useFeedStore(
    (state) => state.activeEntry,
  )

  const updateEntry = useUpdateEntry({
    entryId: entry?.id,
  })

  const read = useMutation({
    mutationFn: async () =>
      apiFetch("/reads", {
        method: "POST",
        body: {
          entryId: entry?.id,
        },
      }),
    onSuccess: () => {
      updateEntry({
        read: true,
      })
    },
  })

  const itemRef = useRef<HTMLDivElement>(null)
  useHover((state) => {
    if (state.active && !entry.read) {
      read.mutate()
    }
  }, {
    target: itemRef,
  })

  if (!entry?.url || view === undefined) return children

  return (
    <div
      key={entry.id}
      className={cn(
        "rounded-md transition-colors",
        activeEntry === entry.id && "bg-native-active",
        entry.read && "text-foreground/50",
      )}
      ref={itemRef}
      onClick={(e) => {
        e.stopPropagation()
        feedActions.setActiveEntry(entry.id)
      }}
      onDoubleClick={() => window.open(entry.url, "_blank")}
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
