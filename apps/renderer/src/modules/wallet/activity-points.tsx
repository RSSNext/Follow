import { cn } from "~/lib/utils"

export const ActivityPoints = ({ points, className }: { points: number; className?: string }) => {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <i className="i-mgc-fire-cute-fi text-red-500" />
      <span>{points}</span>
      <sub className="-translate-y-px text-[0.6rem] font-normal">x{Math.floor(points / 10)}</sub>
    </div>
  )
}
