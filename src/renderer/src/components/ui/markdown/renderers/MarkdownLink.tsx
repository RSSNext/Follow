import { FeedViewType } from "@renderer/lib/enum"
import { useEntryContentContext } from "@renderer/modules/entry-content/hooks"

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
            {props.href}
          </TooltipContent>
        </TooltipPortal>
      )}
    </Tooltip>
  )
}
