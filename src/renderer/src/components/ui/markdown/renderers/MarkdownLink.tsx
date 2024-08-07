import { useNavigateEntry } from "@renderer/hooks/biz/useNavigateEntry"
import { FeedViewType } from "@renderer/lib/enum"
import { useEntryContentContext } from "@renderer/modules/entry-content/hooks"
import { useEntry } from "@renderer/store/entry"
import { useCallback } from "react"

import type { LinkProps } from "../../link"
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from "../../tooltip"
import { ensureAndRenderTimeStamp } from "../utils"

export const MarkdownLink = (props: LinkProps) => {
  const { view } = useEntryContentContext()

  const entryId = (/^\w{17}$/.test(props.href)) ? props.href : null
  const entry = useEntry(entryId)

  const navigate = useNavigateEntry()
  const onClick = useCallback((e: React.MouseEvent) => {
    if (entryId) {
      e.preventDefault()
      navigate({
        entryId,
      })
    }
  }, [entryId, navigate])

  const parseTimeStamp = view === FeedViewType.Audios
  if (parseTimeStamp) {
    const childrenText = props.children

    if (typeof childrenText === "string") {
      const renderer = ensureAndRenderTimeStamp(childrenText)
      if (renderer) return renderer
    }
  }

  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <a
          className="follow-link--underline font-semibold text-foreground no-underline"
          href={props.href}
          title={props.title}
          target="_blank"
          onClick={onClick}
        >
          {props.children}

          {typeof props.children === "string" && (
            <i className="i-mgc-arrow-right-up-cute-re size-[0.9em] translate-y-[2px] opacity-70" />
          )}
        </a>
      </TooltipTrigger>
      {!!props.href && (
        <TooltipPortal>
          <TooltipContent align="start" className="break-all" side="bottom">
            {entry?.entries.title || props.href}
          </TooltipContent>
        </TooltipPortal>
      )}
    </Tooltip>
  )
}
