import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@renderer/components/ui/tooltip"
import { cn } from "@renderer/lib/utils"
import { useEntryActions } from "@renderer/hooks/useEntryActions"
import { items } from "@renderer/components/entry-column/context-menu"

export function EntryShare({ view, url }: { view: number; url?: string }) {
  if (!url) return null

  const { execAction } = useEntryActions(url)

  return (
    <div className="px-5 h-14 flex items-center text-lg justify-end text-zinc-500 gap-5">
      <TooltipProvider delayDuration={300}>
        {items[view].map((item) => (
          <Tooltip>
            <TooltipTrigger className="flex items-center my-2">
              <i
                className={cn(item.className, "cursor-pointer no-drag-region")}
                onClick={() => execAction(item.action)}
              />
            </TooltipTrigger>
            <TooltipContent side="bottom">{item.name}</TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  )
}
