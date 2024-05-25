import { useMainLayoutContext } from "@renderer/contexts/outlet/main-layout"
import { useEntryActions } from "@renderer/hooks/useEntryActions"
import { showNativeMenu } from "@renderer/lib/native-menu"
import type { EntriesResponse } from "@renderer/lib/types"
import { cn } from "@renderer/lib/utils"

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

  const { activeEntry, setActiveEntry } = useMainLayoutContext()
  if (!entry?.url || view === undefined) return children

  return (
    <div
      key={entry.id}
      className={cn(
        "rounded-md transition-colors",
        activeEntry === entry.id && "bg-[#DEDDDC]",
      )}
      onClick={(e) => {
        e.stopPropagation()
        setActiveEntry(entry.id)
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
