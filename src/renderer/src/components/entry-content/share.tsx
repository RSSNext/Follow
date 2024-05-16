import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@renderer/components/ui/tooltip"
import { cn } from "@renderer/lib/utils"
import { useEntryActions } from "@renderer/hooks/useEntryActions"
import { items } from "@renderer/components/entry-column/context-menu"
import { ActivedEntry } from "@renderer/lib/types"

export function EntryShare({
  view,
  entry,
}: {
  view: number
  entry: ActivedEntry
}) {
  if (!entry?.url) return null

  const { execAction } = useEntryActions({
    url: entry.url,
    images: entry.images,
  })

  return (
    <div className="px-5 h-14 flex items-center text-lg justify-end text-zinc-500 gap-5">
      <TooltipProvider delayDuration={300}>
        {items[view].map((item) => (
          <Tooltip key={item.name}>
            <TooltipTrigger className="flex items-center my-2">
              {item.icon ? (
                <img
                  className="w-4 h-4 grayscale cursor-pointer no-drag-region"
                  src={item.icon}
                  onClick={() => execAction(item.action)}
                />
              ) : (
                <i
                  className={cn(
                    item.className,
                    "cursor-pointer no-drag-region",
                  )}
                  onClick={() => execAction(item.action)}
                />
              )}
            </TooltipTrigger>
            <TooltipContent side="bottom">{item.name}</TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  )
}
