import { Image } from "@renderer/components/ui/image"
import { useRouteParamsSelector } from "@renderer/hooks/biz/useRouteParams"
import { urlToIframe } from "@renderer/lib/url-to-iframe"
import { cn } from "@renderer/lib/utils"
import { GridItem } from "@renderer/modules/entry-column/grid-item-template"
import { useEntry } from "@renderer/store/entry/hooks"
import { useHover } from "@use-gesture/react"
import { useMemo, useRef, useState } from "react"

import { ReactVirtuosoItemPlaceholder } from "../../components/ui/placeholder"
import type { UniversalItemProps } from "./types"

export function VideoItem({ entryId, entryPreview, translation }: UniversalItemProps) {
  const entry = useEntry(entryId) || entryPreview

  const isActive = useRouteParamsSelector(({ entryId }) => entryId === entry?.entries.id)

  const iframeSrc = useMemo(() => urlToIframe(entry?.entries.url), [entry?.entries.url])

  const ref = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)
  useHover(
    (event) => {
      setHovered(event.active)
    },
    {
      target: ref,
    },
  )

  if (!entry) return <ReactVirtuosoItemPlaceholder />
  return (
    <GridItem entryId={entryId} entryPreview={entryPreview} translation={translation}>
      <div className="w-full">
        <div className="overflow-x-auto" ref={ref}>
          {iframeSrc && hovered ? (
            // eslint-disable-next-line @eslint-react/dom/no-missing-iframe-sandbox
            <iframe
              src={iframeSrc}
              className={cn("pointer-events-none aspect-video w-full shrink-0 rounded-md bg-black object-cover", isActive && "rounded-b-none")}
            />
          ) : (
            <Image
              key={entry.entries.images?.[0]}
              src={entry.entries.images?.[0]}
              className={cn("aspect-video w-full shrink-0 rounded-md object-cover", isActive && "rounded-b-none")}
              loading="lazy"
              proxy={{
                width: 640,
                height: 360,
              }}
              disableContextMenu
            />
          )}
        </div>
      </div>
    </GridItem>
  )
}
