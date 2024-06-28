import { cn } from "@renderer/lib/utils"
import { format } from "dnum"

import { Tooltip, TooltipContent, TooltipTrigger } from "../tooltip"

export const Balance = ({
  children,
  className,
  precision = 2,
  withSuffix = false,
  withTooltip = true,
}: {
  /** The token balance in wei. */
  children: bigint | string
  className?: string
  precision?: number
  withSuffix?: boolean
  withTooltip?: boolean
}) => {
  const n = [BigInt(children), 18] as const
  const formatted = format(n, { digits: precision, trailingZeros: true })
  const formattedFull = format(n, { digits: 18, trailingZeros: true })

  const Content = (
    <div className={cn("font-mono tabular-nums", className)}>
      {formatted}
      {" "}
      {withSuffix && <span>POWER</span>}
    </div>
  )

  if (!withTooltip) return Content

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {Content}
      </TooltipTrigger>
      <TooltipContent>
        <div className="font-mono text-sm">
          <span className="font-bold tabular-nums">{formattedFull}</span>
          {" "}
          <span>POWER</span>
        </div>
      </TooltipContent>
    </Tooltip>
  )
}
