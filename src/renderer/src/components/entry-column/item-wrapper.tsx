import { ActivedEntry, EntriesResponse } from "@renderer/lib/types"
import { cn } from "@renderer/lib/utils"
import { showNativeMenu } from "@renderer/lib/native-menu"
import { useEntryActions } from "@renderer/hooks/useEntryActions"
import { useOutletContext } from "react-router-dom"

export function EntryItemWrapper({
  entry,
  children,
  view,
}: {
  entry: EntriesResponse[number]
  children: React.ReactNode
  view?: number
}) {
  if (!entry?.url || view === undefined) return children

  const { items } = useEntryActions({
    view,
    entry,
  })
  const { activedEntry, setActivedEntry } = useOutletContext<{
    activedEntry: ActivedEntry
    setActivedEntry: (value: ActivedEntry) => void
  }>()

  return (
    <div
      key={entry.id}
      className={cn(
        "rounded-md transition-colors",
        activedEntry === entry.id && "bg-[#DEDDDC]",
      )}
      onClick={(e) => {
        e.stopPropagation()
        setActivedEntry(entry.id)
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
