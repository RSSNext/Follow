import { Skeleton } from "~/components/ui/skeleton"
import { cn } from "~/lib/utils"

export const ActivityPoints = ({
  points,
  className,
  isLoading,
}: {
  points: number
  className?: string
  isLoading?: boolean
}) => {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <i className="i-mgc-fire-cute-fi text-red-500" />
      <span>{isLoading ? <Skeleton className="size-4" /> : points}</span>
      <sub className="-translate-y-px text-[0.6rem] font-normal">{Math.floor(points / 10)}x</sub>
    </div>
  )
}
