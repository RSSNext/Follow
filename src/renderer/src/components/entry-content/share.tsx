import { Button } from "@renderer/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@renderer/components/ui/tooltip"
import { useEntryActions } from "@renderer/hooks/useEntryActions"
import type { EntriesResponse } from "@renderer/lib/types"

export function EntryShare({
  view,
  entry,
}: {
  view: number
  entry?: EntriesResponse[number]
}) {
  const { items } = useEntryActions({
    view,
    entry,
  })
  if (!entry?.url) return null

  return (
    <div className="flex h-14 items-center justify-end gap-3 px-5 text-lg text-zinc-500">
      <TooltipProvider>
        {items
          .filter((item) => !item.disabled)
          .map((item) => (
            <Tooltip key={item.name}>
              <TooltipTrigger asChild>
                <Button
                  className="no-drag-region flex items-center text-xl"
                  variant="ghost"
                  size="sm"
                  onClick={item.onClick}
                >
                  {item.icon ?
                      (
                        <img className="size-4 grayscale" src={item.icon} />
                      ) :
                      (
                        <i className={item.className} />
                      )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">{item.name}</TooltipContent>
            </Tooltip>
          ))}
      </TooltipProvider>
    </div>
  )
}
