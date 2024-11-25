import { Tooltip, TooltipContent, TooltipTrigger } from "@follow/components/ui/tooltip/index.js"
import { cn, toScientificNotation } from "@follow/utils/utils"
import { format } from "dnum"

export const Balance = ({
  children,
  value,
  className,
  precision = 2,
  withSuffix = false,
  withTooltip = false,
  scientificThreshold = 6,
}: {
  /** The token balance in wei. */
  children: bigint | string
  value?: bigint | string
  className?: string
  precision?: number
  withSuffix?: boolean
  withTooltip?: boolean
  scientificThreshold?: number
}) => {
  const n = [BigInt(children || 0n) || BigInt(value || 0n), 18] as const
  const formatted = format(n, { digits: precision, trailingZeros: true })
  const formattedFull = format(n, { digits: 18, trailingZeros: true })

  const Content = (
    <span className={cn("tabular-nums", className)}>
      {withSuffix && <i className="i-mgc-power mr-1 -translate-y-px align-middle text-accent" />}
      <span>{withTooltip ? toScientificNotation(formatted, scientificThreshold) : formatted}</span>
    </span>
  )

  if (!withTooltip) return Content

  return (
    <Tooltip>
      <TooltipTrigger asChild>{Content}</TooltipTrigger>
      <TooltipContent>
        <div className="text-sm">
          <span className="font-bold tabular-nums">{formattedFull}</span> <span>Power</span>
        </div>
      </TooltipContent>
    </Tooltip>
  )
}
