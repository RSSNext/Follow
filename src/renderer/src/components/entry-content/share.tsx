import { ActionButton } from "@renderer/components/ui/button"
import {
  TooltipProvider,
} from "@renderer/components/ui/tooltip"
import { useEntryActions } from "@renderer/hooks/useEntryActions"
import { useEntry } from "@renderer/store/entry/hooks"

export function EntryShare({
  view,
  entryId,
}: {
  view: number
  entryId: string
}) {
  const entry = useEntry(entryId)

  const { items } = useEntryActions({
    view,
    entry,
  })
  if (!entry?.entries.url) return null

  return (
    <div className="flex items-center justify-end gap-3 px-5 pt-2.5 text-lg text-zinc-500">
      <TooltipProvider>
        {items
          .filter((item) => !item.disabled)
          .map((item) => (
            <ActionButton
              icon={
                item.icon ?
                    (
                      <img className="size-4 grayscale" src={item.icon} />
                    ) :
                    (
                      <i className={item.className} />
                    )
              }
              onClick={item.onClick}
              tooltip={item.name}
              key={item.name}
            />
          ))}
      </TooltipProvider>
    </div>
  )
}
