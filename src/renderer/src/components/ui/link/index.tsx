import { Tooltip, TooltipContent, TooltipTrigger } from "../tooltip"

interface LinkProps {
  href: string
  title: string
  children: React.ReactNode
  target: string
}

export const LinkWithTooltip = (props: LinkProps) => (
  <Tooltip delayDuration={0}>
    <TooltipTrigger>
      <a href={props.href} title={props.title} target={props.target}>{props.children}</a>
    </TooltipTrigger>
    <TooltipContent align="start" side="bottom">
      {props.href}
    </TooltipContent>
  </Tooltip>
)
