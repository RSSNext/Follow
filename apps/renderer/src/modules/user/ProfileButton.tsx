import { repository } from "@pkg"
import type { FC } from "react"
import { forwardRef, memo, useCallback, useLayoutEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

import { useSignOut } from "~/hooks/biz/useSignOut"
import { useMeasure } from "~/hooks/common"
import { nextFrame } from "~/lib/dom"
import { cn } from "~/lib/utils"
import { useAchievementModal } from "~/modules/achievement/hooks"
import { usePresentUserProfileModal } from "~/modules/profile/hooks"
import { useSettingModal } from "~/modules/settings/modal/hooks"
import { Balance } from "~/modules/wallet/balance"
import { useSession } from "~/queries/auth"
import { useWallet } from "~/queries/wallet"

import { ActionButton } from "../../components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu/dropdown-menu"
import { RootPortal } from "../../components/ui/portal"
import type { LoginProps } from "./LoginButton"
import { LoginButton } from "./LoginButton"
import { UserAvatar } from "./UserAvatar"

export const ProfileButton: FC<LoginProps> = memo((props) => {
  const { status, session } = useSession()
  const { user } = session || {}
  const signOut = useSignOut()
  const settingModalPresent = useSettingModal()
  const presentUserProfile = usePresentUserProfileModal("dialog")
  const presentAchievement = useAchievementModal()
  const { t } = useTranslation()

  const [dropdown, setDropdown] = useState(false)

  const navigate = useNavigate()

  if (status !== "authenticated") {
    return <LoginButton {...props} />
  }

  return (
    <>
      <DropdownMenu onOpenChange={setDropdown}>
        <DropdownMenuTrigger
          asChild
          className="!outline-none focus-visible:bg-theme-item-hover data-[state=open]:bg-transparent"
        >
          <TransitionAvatar stage={dropdown ? "zoom-in" : ""} />
        </DropdownMenuTrigger>

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
              navigate("/power")
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
    </>
  )
})
ProfileButton.displayName = "ProfileButton"

const TransitionAvatar = forwardRef<
  HTMLButtonElement,
  {
    stage: "zoom-in" | ""
  } & React.HTMLAttributes<HTMLButtonElement>
>(({ stage, ...props }, forwardRef) => {
  const [ref, { x, y }, forceRefresh] = useMeasure()
  const [avatarHovered, setAvatarHovered] = useState(false)

  const zoomIn = stage === "zoom-in"
  const [currentZoomIn, setCurrentZoomIn] = useState(false)
  useLayoutEffect(() => {
    if (zoomIn) {
      setCurrentZoomIn(true)
    }
  }, [zoomIn])

  return (
    <>
      <ActionButton
        {...props}
        ref={forwardRef}
        onMouseEnter={useCallback(() => {
          forceRefresh()
          setAvatarHovered(true)
        }, [forceRefresh])}
        onMouseLeave={useCallback(() => {
          setAvatarHovered(false)
        }, [])}
      >
        <UserAvatar ref={ref} className="h-6 p-0 [&_*]:border-0" hideName />
      </ActionButton>
      {x !== 0 && y !== 0 && (avatarHovered || zoomIn || currentZoomIn) && (
        <RootPortal>
          <UserAvatar
            style={{
              left: x - (zoomIn ? 16 : 0),
              top: y,
            }}
            className={cn(
              "pointer-events-none fixed -bottom-6 p-0 duration-200 [&_*]:border-0",
              "transform-gpu will-change-[left,top,height]",
              zoomIn ? "z-[99] h-14" : "z-[-1] h-6",
            )}
            hideName
            onTransitionEnd={() => {
              if (!zoomIn && currentZoomIn) {
                setCurrentZoomIn(false)
              }
            }}
          />
        </RootPortal>
      )}
    </>
  )
})

function PowerButton() {
  const wallet = useWallet()
  const { isLoading } = wallet
  const myWallet = wallet.data?.[0]

  return (
    <div className="flex items-center gap-1">
      <i className="i-mgc-power text-accent" />
      {isLoading ? (
        <span className="h-3 w-8 animate-pulse rounded-xl bg-theme-inactive" />
      ) : (
        <Balance>
          {BigInt(myWallet?.dailyPowerToken || 0n) + BigInt(myWallet?.cashablePowerToken || 0n)}
        </Balance>
      )}
    </div>
  )
}

function LevelButton() {
  return (
    <div className="flex items-center gap-1">
      <i className="i-mgc-vip-2-cute-fi text-accent" />
      <span>Lv.1</span>
      <sub className="-translate-y-px text-[0.6rem] font-normal">x1</sub>
    </div>
  )
}
