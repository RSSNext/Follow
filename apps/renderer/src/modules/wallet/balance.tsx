import { format } from "dnum"

import { cn } from "~/lib/utils"

import { Tooltip, TooltipContent, TooltipTrigger } from "../../components/ui/tooltip"

export const Balance = ({
  children,
  value,
  className,
  precision = 2,
  withSuffix = false,
  withTooltip = false,
}: {
  /** The token balance in wei. */
  children: bigint | string
  value?: bigint | string
  className?: string
  precision?: number
  withSuffix?: boolean
  withTooltip?: boolean
}) => {
  const n = [BigInt(children || 0n) || BigInt(value || 0n), 18] as const
  const formatted = format(n, { digits: precision, trailingZeros: true })
  const formattedFull = format(n, { digits: 18, trailingZeros: true })

  const Content = (
    <div className={cn("inline-flex items-center gap-1 tabular-nums", className)}>
      {withSuffix && <i className="i-mgc-power align-text-bottom text-accent" />}
      <span>{formatted}</span>
    </div>
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
