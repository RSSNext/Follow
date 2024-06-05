import { FeedIcon } from "@renderer/components/feed-icon"
import { Image } from "@renderer/components/ui/image"
import dayjs from "@renderer/lib/dayjs"
import { urlToIframe } from "@renderer/lib/url-to-iframe"
import { cn } from "@renderer/lib/utils"
import { useEntry } from "@renderer/store/entry"
import { useHover } from "@use-gesture/react"
import { useMemo, useRef, useState } from "react"

import { ReactVirtuosoItemPlaceholder } from "../ui/placeholder"
import type { UniversalItemProps } from "./types"

export function VideoItem({ entryId, entryPreview }: UniversalItemProps) {
  const entry = useEntry(entryId) || entryPreview

  const iframeSrc = useMemo(() => urlToIframe(entry.entries.url), [entry.entries.url])

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
    <div className="flex">
      <div className="w-full">
        <div className="overflow-x-auto" ref={ref}>
          {iframeSrc && hovered ? (
            <iframe
              src={iframeSrc}
              className="pointer-events-none aspect-video w-full shrink-0 rounded-md bg-black object-cover"
            />
          ) : (
            <Image
              key={entry.entries.images?.[0]}
              src={entry.entries.images?.[0]}
              className="aspect-video w-full shrink-0 rounded-md object-cover"
              loading="lazy"
              proxy={{
                width: 640,
                height: 360,
              }}
              disableContextMenu
            />
          )}
        </div>
        <div className="flex-1 px-2 pb-3 pt-1 text-sm">
          <div className={cn("relative mb-0.5 mt-1 truncate font-medium", !!entry.collections && "pr-4")}>
            {entry.entries.title}
            {!!entry.collections && (
              <i className="i-mingcute-star-fill absolute right-0 top-0.5 text-orange-400" />
            )}
          </div>
          <div className="flex items-center gap-1 truncate text-xs">
            <FeedIcon
              className="mr-0.5 inline-block size-3"
              feed={entry.feeds}
            />
            <span>{entry.entries.author}</span>
            <span className="text-zinc-500">·</span>
            <span className="text-zinc-500">
              {dayjs
                .duration(
                  dayjs(entry.entries.publishedAt).diff(dayjs(), "minute"),
                  "minute",
                )
                .humanize()}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
