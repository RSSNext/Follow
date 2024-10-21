export const BoostProgress = ({
  level,
  boostCount,
  remainingBoostsToLevelUp,
}: {
  level: number
  boostCount: number
  remainingBoostsToLevelUp: number
}) => {
  const percentage = (boostCount / (boostCount + remainingBoostsToLevelUp)) * 100
  const nextLevel = level + 1
  return (
    <div className="flex w-full flex-col px-2">
      <div className="relative w-full pt-12">
        <span
          className="absolute bottom-0 mb-10 flex h-8 w-12 -translate-x-1/2 items-center justify-center whitespace-nowrap rounded-full bg-white px-3.5 py-2 text-sm font-bold text-gray-800 transition-all duration-500 ease-out after:absolute after:bottom-[-5px] after:left-1/2 after:-z-10 after:flex after:size-3 after:-translate-x-1/2 after:rotate-45 after:bg-white"
          style={{ left: `${percentage}%` }}
        >
          🌟 {boostCount}
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
        {remainingBoostsToLevelUp} more boost will unlock the next level of privilege.
      </small>
    </div>
  )
}
