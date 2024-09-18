import { repository } from "@pkg"
import type { FC } from "react"
import { memo } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { useSignOut } from "~/hooks/biz/useSignOut"
import { useAuthQuery } from "~/hooks/common"
import { apiClient } from "~/lib/api-fetch"
import { defineQuery } from "~/lib/defineQuery"
import { nextFrame } from "~/lib/dom"
import { cn } from "~/lib/utils"
import { LoginModalContent } from "~/modules/auth/LoginModalContent"
import { usePresentUserProfileModal } from "~/modules/profile/hooks"
import { useSettingModal } from "~/modules/settings/modal/hooks"
import { useSession } from "~/queries/auth"

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
import { useModalStack } from "./ui/modal/stacked/hooks"
import { NoopChildren } from "./ui/modal/stacked/utils"

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
                CustomModalComponent: NoopChildren,
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
  const { t } = useTranslation()
  if (status !== "authenticated") {
    return <LoginButton {...props} />
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="!outline-none focus-visible:bg-theme-item-hover">
        <ActionButton tooltip={t("words.user")}>
          <UserAvatar className="h-5 p-0 [&_*]:border-0" hideName />
        </ActionButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[180px]" side="bottom" align="end">
        <DropdownMenuLabel className="text-xs text-theme-foreground/60">
          {t("user_button.account")}
        </DropdownMenuLabel>
        <DropdownMenuLabel>
          <div className="-mt-1 flex items-center gap-2">
            <UserAvatar className="h-7 shrink-0 p-0" hideName />
            <div className="max-w-40 leading-none">
              <div className="truncate">{user?.name}</div>
              <div className="truncate text-xs font-medium text-zinc-500">{user?.handle}</div>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            presentUserProfile(user?.id)
          }}
          icon={<i className="i-mgc-user-3-cute-re" />}
        >
          {t("user_button.profile")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => {
            nextFrame(() => settingModalPresent("wallet"))
          }}
          icon={<i className="i-mgc-power-outline" />}
        >
          {t("user_button.power")}
        </DropdownMenuItem>
        <DropdownMenuItem
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
        <DropdownMenuItem onClick={signOut} icon={<i className="i-mgc-exit-cute-re" />}>
          {t("user_button.log_out")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
})
ProfileButton.displayName = "ProfileButton"

export function UserAvatar({
  className,
  avatarClassName,
  hideName,
  userId,
  enableModal,
  ...props
}: {
  className?: string
  avatarClassName?: string
  hideName?: boolean
  userId?: string
  enableModal?: boolean
} & LoginProps) {
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

  return (
    <div
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
          src={(profile.data || session?.user)?.image || undefined}
        />
        <AvatarFallback>{(profile.data || session?.user)?.name?.slice(0, 2)}</AvatarFallback>
      </Avatar>
      {!hideName && <div>{(profile.data || session?.user)?.name}</div>}
    </div>
  )
}

// const AppTheme = () => {
//   const theme = useThemeAtomValue()
//   const setTheme = useSetTheme()
//   return (
//     <SettingTabbedSegment
//       className="mb-0"
//       label={(
//         <span>
//           <i className="i-mgc-palette-cute-re mr-2 translate-y-0.5" />
//           <span className="text-sm font-normal">
//             Theme
//           </span>
//         </span>
//       )}
//       value={theme}
//       values={[
//         {
//           value: "system",
//           label: "",
//           icon: <i className="i-mingcute-monitor-line" />,
//         },
//         {
//           value: "light",
//           label: "",
//           icon: <i className="i-mingcute-sun-line" />,
//         },
//         {
//           value: "dark",
//           label: "",
//           icon: <i className="i-mingcute-moon-line" />,
//         },
//       ]}
//       onValueChanged={(value) => {
//         setTheme(value as "light" | "dark" | "system")
//       }}
//     />
//   )
// }
