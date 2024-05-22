import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@renderer/components/ui/tooltip"
import { useEntryActions } from "@renderer/hooks/useEntryActions"
import { EntriesResponse } from "@renderer/lib/types"
import { Button } from "@renderer/components/ui/button"

export function EntryShare({
  view,
  entry,
}: {
  view: number
  entry?: EntriesResponse[number]
}) {
  if (!entry?.url) return null

  const { items } = useEntryActions({
    view,
    entry,
  })

  return (
    <div className="px-5 h-14 flex items-center text-lg justify-end text-zinc-500 gap-3">
      <TooltipProvider>
        {items
          .filter((item) => !item.disabled)
          .map((item) => (
            <Tooltip key={item.name}>
              <TooltipTrigger asChild>
                <Button
                  className="flex items-center text-xl no-drag-region"
                  variant="ghost"
                  size="sm"
                  onClick={item.onClick}
                >
                  {item.icon ? (
                    <img className="w-4 h-4 grayscale" src={item.icon} />
                  ) : (
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
