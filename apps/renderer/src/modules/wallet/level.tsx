export const multiples = [0.1, 1, 2, 5, 18]

export const Level = ({ level, isLoading }: { level: number; isLoading?: boolean }) => {
  return (
    <div className="flex items-center gap-1">
      <i className="i-mgc-vip-2-cute-fi text-accent" />
      {isLoading ? (
        <span className="h-3 w-8 animate-pulse rounded-xl bg-theme-inactive" />
      ) : (
        <>
          <span>Lv.{level}</span>
          <sub className="-translate-y-px text-[0.6rem] font-normal">x{multiples[level]}</sub>
        </>
      )}
    </div>
  )
}
