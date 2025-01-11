import { Divider } from "@follow/components/ui/divider/Divider.js"
import { PresentSheet } from "@follow/components/ui/sheet/Sheet.js"
import { EllipsisHorizontalTextWithTooltip } from "@follow/components/ui/typography/EllipsisWithTooltip.js"
import { UserRole } from "@follow/constants"
import { UrlBuilder } from "@follow/utils/url-builder"
import clsx from "clsx"
import type { FC } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router"

import rsshubLogoUrl from "~/assets/rsshub-icon.png?url"
import { useUserRole, useWhoami } from "~/atoms/user"
import { useSignOut } from "~/hooks/biz/useSignOut"
import { useWallet } from "~/queries/wallet"

import { useAchievementModal } from "../achievement/hooks"
import { useActivationModal } from "../activation"
import { usePresentUserProfileModal } from "../profile/hooks"
import { useSettingModal } from "../settings/modal/use-setting-modal-hack"
import { ActivityPoints } from "../wallet/activity-points"
import { Level } from "../wallet/level"
import type { ProfileButtonProps } from "./ProfileButton.desktop"
import { PowerButton } from "./ProfileButton.shared"
import { UserAvatar } from "./UserAvatar"

export const ProfileButton: FC<ProfileButtonProps> = () => {
  const user = useWhoami()

  const signOut = useSignOut()

  const presentUserProfile = usePresentUserProfileModal("dialog")
  const presentAchievement = useAchievementModal()
  const { t } = useTranslation()

  const role = useUserRole()
  const wallet = useWallet()
  const { isLoading: isLoadingWallet } = wallet
  const myWallet = wallet.data?.[0]
  const presentActivationModal = useActivationModal()
  const settingModalPresent = useSettingModal()
  return (
    <PresentSheet
      zIndex={99}
      content={
        <>
          <div className="p-4 pt-0">
            <div className="flex flex-col items-center gap-1 text-center leading-none">
              <UserAvatar hideName className="size-16 p-0 [&_*]:border-0" />
              <EllipsisHorizontalTextWithTooltip className="mx-auto max-w-[20ch] truncate text-lg">
                {user?.name}
              </EllipsisHorizontalTextWithTooltip>
              {!!user?.handle && (
                <a href={UrlBuilder.profile(user.handle)} target="_blank" className="block">
                  <EllipsisHorizontalTextWithTooltip className="truncate text-xs font-medium text-zinc-500">
                    @{user.handle}
                  </EllipsisHorizontalTextWithTooltip>
                </a>
              )}
            </div>
          </div>

          <Link
            to="/power"
            className="mx-auto flex w-[300px] items-center justify-between font-semibold"
          >
            <PowerButton isLoading={isLoadingWallet} myWallet={myWallet} />
            <Level level={myWallet?.level?.level || 0} isLoading={isLoadingWallet} />
            <ActivityPoints
              className="text-sm"
              points={myWallet?.level?.prevActivityPoints || 0}
              isLoading={isLoadingWallet}
            />
          </Link>

          <Divider className="h-px !bg-border" />

          <div className="mx-auto w-full max-w-[350px]">
            <Item
              icon={<i className="i-mgc-user-3-cute-re" />}
              label={t("user_button.profile")}
              onClick={() => {
                presentUserProfile(user?.id)
              }}
            />

            <Item
              label={t("user_button.achievement")}
              onClick={() => {
                if (role !== UserRole.Trial) {
                  presentAchievement()
                } else {
                  presentActivationModal()
                }
              }}
              icon={<i className="i-mgc-trophy-cute-re" />}
            />

            <Divider className="mx-auto h-px w-[50px] !bg-border/80" />

            <Item
              label={t("user_button.actions")}
              link="/action"
              icon={<i className="i-mgc-magic-2-cute-re" />}
            />
            <Item
              label={t("user_button.preferences")}
              onClick={() => {
                settingModalPresent()
              }}
              icon={<i className="i-mgc-settings-7-cute-re" />}
            />
            <Item
              label={t("words.rsshub")}
              link="/rsshub"
              icon={<img src={rsshubLogoUrl} className="size-3 grayscale" />}
            />
            <Item
              label={t("user_button.log_out")}
              onClick={signOut}
              icon={<i className="i-mgc-exit-cute-re" />}
            />
          </div>
        </>
      }
    >
      <UserAvatar hideName className="size-6 shrink-0 p-0 [&_*]:border-0" />
    </PresentSheet>
  )
}

const Item: FC<{ icon: React.ReactNode; label: string; onClick?: () => void; link?: string }> = ({
  icon,
  label,
  onClick,
  link,
}) => {
  const containerClassName = clsx(
    "relative flex w-full select-none items-center rounded-sm px-4 py-1.5 outline-none transition-colors focus:bg-theme-item-hover",
    "text-base font-medium",
    "focus-within:!outline-transparent",
  )

  const children = (
    <>
      <span className="mr-1.5 inline-flex size-4 items-center justify-center">{icon}</span>

      {label}
      {/* Justify Fill */}
      <span className="ml-1.5 size-4" />
    </>
  )

  if (link) {
    return (
      <Link to={link} className={containerClassName}>
        {children}
      </Link>
    )
  }

  return (
    <button type="button" onClick={onClick} className={containerClassName}>
      {children}
    </button>
  )
}
