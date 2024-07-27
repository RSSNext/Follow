import type { LinkProps } from "../../link"
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from "../../tooltip"

export const MarkdownLink = (props: LinkProps) => (
  <Tooltip

    delayDuration={0}
  >
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
