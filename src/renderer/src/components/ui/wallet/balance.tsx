import { cn } from "@renderer/lib/utils"
import { format } from "dnum"

import { Tooltip, TooltipContent, TooltipTrigger } from "../tooltip"

export const Balance = ({
  children,
  className,
  precision = 2,
  withSuffix = false,
}: {
  /** The token balance in wei. */
  children: bigint
  className?: string
  precision?: number
  withSuffix?: boolean
}) => {
  const from = [BigInt(children), 18] as const
  const formatted = format(from, { digits: precision, trailingZeros: true })
  const formattedFull = format(from, { digits: 18, trailingZeros: true })
  return (
    <Tooltip>
      <TooltipTrigger>
        <span className={cn("font-mono tabular-nums", className)}>
          {formatted}
          {" "}
          {withSuffix && <span>$POWER</span>}
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <div className="font-mono text-sm">
          <span className="font-bold tabular-nums">{formattedFull}</span>
          {" "}
          <span>$POWER</span>
        </div>
      </TooltipContent>
    </Tooltip>
  )
}
