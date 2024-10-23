import { cn } from "~/lib/utils"

export const BoostProgress = ({
  level,
  boostCount,
  remainingBoostsToLevelUp,
  lastValidBoost,
}: {
  level: number
  boostCount: number
  remainingBoostsToLevelUp: number
  lastValidBoost: {
    hash: string | null
    expiresAt: string
  } | null
}) => {
  const percentage = (boostCount / (boostCount + remainingBoostsToLevelUp)) * 100
  const nextLevel = level + 1
  return (
    <div className="flex w-full flex-col px-2">
      <div className="relative w-full pt-12">
        <span
          className={cn(
            "absolute bottom-0 mb-10 flex h-8 w-12 -translate-x-1/2 items-center justify-center whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-bold text-white transition-all duration-500 ease-out after:absolute after:bottom-[-5px] after:left-1/2 after:-z-10 after:flex after:size-3 after:-translate-x-1/2 after:rotate-45 ",
            "bg-orange-500 after:bg-orange-500",
          )}
          style={{ left: `${percentage}%` }}
        >
          <i className="i-mgc-train-cute-fi mr-2 shrink-0" />
          {boostCount}
        </span>
        <div className="relative flex h-6 w-full overflow-hidden rounded-3xl bg-gray-200 dark:bg-gray-800">
          <div
            role="progressbar"
            aria-valuenow={boostCount}
            aria-valuemin={0}
            aria-valuemax={remainingBoostsToLevelUp}
            style={{ width: `${percentage}%` }}
            className="flex h-full items-center justify-center rounded-3xl bg-accent text-white transition-all duration-500 ease-out"
          />
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between">
        <span className="text-lg font-bold text-accent">Lv. {level}</span>
        <span className="text-lg font-bold text-accent">Lv. {nextLevel}</span>
      </div>
      <small className="center mt-1 gap-1">
        {remainingBoostsToLevelUp} more boost will unlock the next level of benefits!
      </small>
      {lastValidBoost && (
        <small className="center mt-1 gap-1">
          You can't add more boost points right now, but feel free to keep boosting. Your current
          boost will expire on {new Date(lastValidBoost.expiresAt).toLocaleDateString()}.
        </small>
      )}
    </div>
  )
}
