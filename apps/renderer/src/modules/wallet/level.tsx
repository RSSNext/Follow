import { useTranslation } from "react-i18next"

import { useUserRole } from "~/atoms/user"
import { UserRole } from "~/lib/enum"
import { cn } from "~/lib/utils"

import { useActivationModal } from "../activation"

export const multiples = [0.1, 1, 2, 5, 18]

export const Level = ({
  level,
  isLoading,
  hideIcon,
  className,
}: {
  level: number
  isLoading?: boolean
  hideIcon?: boolean
  className?: string
}) => {
  const role = useUserRole()
  const { t } = useTranslation()
  const presentActivationModal = useActivationModal()
  if (role === UserRole.Trial) {
    return (
      <div className="group relative flex items-center gap-1">
        <span className="duration-100 group-hover:opacity-0">Trial User</span>
        <button
          type="button"
          className="center absolute inset-0 opacity-0 duration-200 group-hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation()
            presentActivationModal()
          }}
        >
          {t("activation.activate")}
        </button>
      </div>
    )
  }
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {!hideIcon && <i className="i-mgc-vip-2-cute-fi text-accent" />}
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
