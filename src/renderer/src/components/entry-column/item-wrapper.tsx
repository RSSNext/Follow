import { ActivedEntry, EntriesResponse } from "@renderer/lib/types"
import { cn } from "@renderer/lib/utils"
import { showNativeMenu } from "@renderer/lib/native-menu"
import { useEntryActions } from "@renderer/hooks/useEntryActions"

export function EntryItemWrapper({
  entry,
  activedEntry,
  setActivedEntry,
  children,
  view,
}: {
  entry: EntriesResponse[number]
  activedEntry: ActivedEntry
  setActivedEntry: (value: ActivedEntry) => void
  children: React.ReactNode
  view?: number
}) {
  if (!entry?.url || view === undefined) return children

  const { items } = useEntryActions({
    view,
    entry,
  })

  return (
    <div
      key={entry.id}
      className={cn(
        "rounded-md transition-colors",
        activedEntry?.id === entry.id && "bg-[#DEDDDC]",
      )}
      onClick={(e) => {
        e.stopPropagation()
        setActivedEntry(entry)
      }}
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
