import * as HoverCard from "@radix-ui/react-hover-card"

import { HTML } from "~/components/ui/markdown"
import { ScrollArea } from "~/components/ui/scroll-area"
import { tooltipStyle } from "~/components/ui/tooltip/styles"
import { useMeasure } from "~/hooks/common"
import { cn } from "~/lib/utils"

export const EntryTranslation: Component<{
  source?: string | null
  target?: string

  side?: "top" | "bottom"

  useOverlay?: boolean
  isHTML?: boolean
}> = ({ source, target, className, side, useOverlay, isHTML }) => {
  let nextTarget = target
  if (source === target) {
    nextTarget = undefined
  }

  const [ref, bounds] = useMeasure({ debounce: 60 })

  if (!source) {
    return null
  }

  if (!nextTarget && source) {
    return isHTML ? (
      <HTML as="div" className={cn("prose dark:prose-invert", className)} noMedia>
        {source}
      </HTML>
    ) : (
      <div className={className}>{source}</div>
    )
  }
  return (
    <HoverCard.Root>
      <HoverCard.Trigger className={className} ref={ref}>
        <i className="i-mgc-translate-2-cute-re mr-1 align-middle" />
        {isHTML ? (
          <HTML as="div" className="align-middle" noMedia>
            {nextTarget}
          </HTML>
        ) : (
          <span className="align-middle">{nextTarget}</span>
        )}
      </HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content
          className={cn(
            "group relative z-[1] text-sm",
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
                {isHTML ? (
                  <HTML as="div" className="align-middle" noMedia>
                    {source}
                  </HTML>
                ) : (
                  <span className="align-middle">{source}</span>
                )}
              </ScrollArea.ScrollArea>
            </div>
          ) : isHTML ? (
            <HTML as="div" className={cn(tooltipStyle.content)} noMedia>
              {source}
            </HTML>
          ) : (
            <span className={cn(tooltipStyle.content)}>{source}</span>
          )}
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  )
}
