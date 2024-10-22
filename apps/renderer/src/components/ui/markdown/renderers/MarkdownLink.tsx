import { useContext } from "react"

import type { LinkProps } from "../../link"
import { Tooltip, TooltipContent, TooltipPortal, TooltipTrigger } from "../../tooltip"
import { MarkdownRenderActionContext } from "../context"

export const MarkdownLink = (props: LinkProps) => {
  const { transformUrl, isAudio, ensureAndRenderTimeStamp } = useContext(
    MarkdownRenderActionContext,
  )

  const populatedFullHref = transformUrl(props.href)

  const parseTimeStamp = isAudio(populatedFullHref)
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
          href={populatedFullHref}
          title={props.title}
          target="_blank"
          rel="noreferrer"
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
            {populatedFullHref}
          </TooltipContent>
        </TooltipPortal>
      )}
    </Tooltip>
  )
}
