import * as HoverCard from "@radix-ui/react-hover-card"
import { ScrollArea } from "@renderer/components/ui/scroll-area"
import { tooltipStyle } from "@renderer/components/ui/tooltip/styles"
import { useMeasure } from "@renderer/hooks/common"
import { cn } from "@renderer/lib/utils"

export const EntryTranslation: Component<{
  source?: string | null
  target?: string

  side?: "top" | "bottom"

  useOverlay?: boolean
}> = ({ source, target, className, side, useOverlay }) => {
  let nextTarget = target
  if (source === target) {
    nextTarget = undefined
  }

  const [ref, bounds] = useMeasure({ debounce: 60 })

  if (!nextTarget && source) {
    return <div className={className}>{source}</div>
  }
  return (
    <HoverCard.Root>
      <HoverCard.Trigger className={className} ref={ref}>
        <i className="i-mgc-translate-2-cute-re mr-1 align-middle" />
        <span className="align-middle">{nextTarget}</span>
      </HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content
          className={cn(
            "group relative text-sm",
            "animate-in fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          )}
          style={useOverlay ? { width: bounds.width } : undefined}
          side={side}
          sideOffset={useOverlay ? 0 : 12}
        >
          {useOverlay ? (
            <div className="absolute inset-x-0">
              <ScrollArea.ScrollArea
                mask
                rootClassName={cn(
                  "shadow-modal rounded-xl border bg-background p-2",
                  "group-data-[side=top]:top-0",
                  "group-data-[side=bottom]:top-full",
                )}
                viewportClassName="max-h-[12ch]"
              >
                <span className="align-middle">{source}</span>
              </ScrollArea.ScrollArea>
            </div>
          ) : (
            <span className={cn(tooltipStyle.content)}>{source}</span>
          )}
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  )
}
