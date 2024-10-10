import { repository } from "@pkg"
import type { FC } from "react"
import { forwardRef, memo, useState } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

import { useWhoami } from "~/atoms/user"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { useSignOut } from "~/hooks/biz/useSignOut"
import { useAuthQuery, useMeasure } from "~/hooks/common"
import { apiClient } from "~/lib/api-fetch"
import { defineQuery } from "~/lib/defineQuery"
import { nextFrame } from "~/lib/dom"
import { replaceImgUrlIfNeed } from "~/lib/img-proxy"
import { cn } from "~/lib/utils"
import { useAchievementModal } from "~/modules/achievement/hooks"
import { LoginModalContent } from "~/modules/auth/LoginModalContent"
import { usePresentUserProfileModal } from "~/modules/profile/hooks"
import { useSettingModal } from "~/modules/settings/modal/hooks"
import { Balance } from "~/modules/wallet/balance"
import { useSession } from "~/queries/auth"
import { useWallet } from "~/queries/wallet"

import { UserArrowLeftIcon } from "./icons/user"
import { ActionButton } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu/dropdown-menu"
import { PlainModal } from "./ui/modal/stacked/custom-modal"
import { useModalStack } from "./ui/modal/stacked/hooks"
import { RootPortal } from "./ui/portal"

interface LoginProps {
  method?: "redirect" | "modal"
}
export const LoginButton: FC<LoginProps> = (props) => {
  const { method } = props
  const modalStack = useModalStack()
  const { t } = useTranslation()
  const Content = (
    <ActionButton
      className="relative z-[1]"
      onClick={
        method === "modal"
          ? () => {
              modalStack.present({
                CustomModalComponent: PlainModal,
                title: "Login",
                id: "login",
                content: () => <LoginModalContent runtime={window.electron ? "app" : "browser"} />,
                clickOutsideToDismiss: true,
              })
            }
          : undefined
      }
      tooltip={t("words.login")}
    >
      <UserArrowLeftIcon className="size-4" />
    </ActionButton>
  )
  return method === "modal" ? Content : <Link to="/login">{Content}</Link>
}
export const ProfileButton: FC<LoginProps> = memo((props) => {
  const { status, session } = useSession()
  const { user } = session || {}
  const signOut = useSignOut()
  const settingModalPresent = useSettingModal()
  const presentUserProfile = usePresentUserProfileModal("dialog")
  const presentAchievement = useAchievementModal()
  const { t } = useTranslation()
  const [ref, { x, y }] = useMeasure()
  const [dropdown, setDropdown] = useState(false)
  if (status !== "authenticated") {
    return <LoginButton {...props} />
  }

  return (
    <DropdownMenu onOpenChange={setDropdown}>
      <DropdownMenuTrigger asChild className="!outline-none focus-visible:bg-theme-item-hover">
        <ActionButton>
          <UserAvatar ref={ref} className="h-6 p-0 [&_*]:border-0" hideName />
        </ActionButton>
      </DropdownMenuTrigger>

      <RootPortal>
        <UserAvatar
          style={{
            left: x,
            top: y,
          }}
          className={cn(
            "pointer-events-none fixed -bottom-6 z-[999] p-0 duration-200 [&_*]:border-0",
            dropdown ? "h-14 -translate-x-4" : "h-6",
          )}
          hideName
        />
      </RootPortal>
      <DropdownMenuContent
        className="min-w-[180px] overflow-visible px-1 pt-4"
        side="bottom"
        align="center"
      >
        <DropdownMenuLabel>
          <div className="text-center leading-none">
            <div className="truncate text-lg">{user?.name}</div>
            <div className="truncate text-xs font-medium text-zinc-500">{user?.handle}</div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuItem
          onClick={() => {
            nextFrame(() => settingModalPresent("wallet"))
          }}
        >
          <div className="flex w-full items-center justify-between gap-6 px-1.5 font-semibold">
            <PowerButton />
            <LevelButton />
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="pl-3"
          onClick={() => {
            presentUserProfile(user?.id)
          }}
          icon={<i className="i-mgc-user-3-cute-re" />}
        >
          {t("user_button.profile")}
        </DropdownMenuItem>

        <DropdownMenuItem
          className="pl-3"
          onClick={() => {
            presentAchievement()
          }}
          icon={<i className="i-mgc-trophy-cute-re" />}
        >
          {t("user_button.achievement")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="pl-3"
          onClick={() => {
            nextFrame(settingModalPresent)
          }}
          icon={<i className="i-mgc-settings-7-cute-re" />}
        >
          {t("user_button.preferences")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {!window.electron && (
          <>
            <DropdownMenuItem
              className="pl-3"
              onClick={() => {
                window.open(`${repository.url}/releases`)
              }}
              icon={<i className="i-mgc-download-2-cute-re" />}
            >
              {t("user_button.download_desktop_app")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem
          className="pl-3"
          onClick={signOut}
          icon={<i className="i-mgc-exit-cute-re" />}
        >
          {t("user_button.log_out")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
})
ProfileButton.displayName = "ProfileButton"

export const UserAvatar = forwardRef<
  HTMLDivElement,
  {
    className?: string
    avatarClassName?: string
    hideName?: boolean
    userId?: string
    enableModal?: boolean
    style?: React.CSSProperties
  } & LoginProps
>(({ className, avatarClassName, hideName, userId, enableModal, style, ...props }, ref) => {
  const { session, status } = useSession({
    enabled: !userId,
  })
  const presentUserProfile = usePresentUserProfileModal("drawer")

  const profile = useAuthQuery(
    defineQuery(["profiles", userId], async () => {
      const res = await apiClient.profiles.$get({
        query: { id: userId! },
      })
      return res.data
    }),
    {
      enabled: !!userId,
    },
  )

  if (!userId && status !== "authenticated") {
    return <LoginButton {...props} />
  }

  const renderUserData = userId ? profile.data : session?.user
  return (
    <div
      style={style}
      ref={ref}
      className={cn(
        "flex h-20 items-center justify-center gap-2 px-5 py-2 font-medium text-zinc-600 dark:text-zinc-300",
        className,
      )}
      onClick={enableModal ? () => presentUserProfile(userId) : undefined}
    >
      <Avatar
        className={cn(
          "aspect-square h-full w-auto overflow-hidden rounded-full border bg-stone-300",
          avatarClassName,
        )}
      >
        <AvatarImage
          className="duration-200 animate-in fade-in-0"
          src={replaceImgUrlIfNeed(renderUserData?.image || undefined)}
        />
        <AvatarFallback>{renderUserData?.name?.slice(0, 2)}</AvatarFallback>
      </Avatar>
      {!hideName && <div>{renderUserData?.name}</div>}
    </div>
  )
})

UserAvatar.displayName = "UserAvatar"
function PowerButton() {
  const user = useWhoami()
  const wallet = useWallet({ userId: user?.id })
  const myWallet = wallet.data?.[0]

  return (
    <div className="flex items-center gap-1">
      <i className="i-mgc-power text-accent" />
      <Balance>
        {BigInt(myWallet?.dailyPowerToken || 0n) + BigInt(myWallet?.cashablePowerToken || 0n)}
      </Balance>
    </div>
  )
}

function LevelButton() {
  return (
    <div className="flex items-center gap-1">
      <i className="i-mgc-vip-2-cute-fi text-accent" />
      <span>Lv.1</span>
      <sub className="text-[0.6rem] font-normal">x1</sub>
    </div>
  )
}
