import { repository } from "@pkg"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@renderer/components/ui/avatar"
import { useSignOut } from "@renderer/hooks/biz/useSignOut"
import {
  useAuthQuery,
  useSetTheme,
  useThemeAtomValue,
} from "@renderer/hooks/common"
import { apiClient } from "@renderer/lib/api-fetch"
import { defineQuery } from "@renderer/lib/defineQuery"
import { nextFrame } from "@renderer/lib/dom"
import { cn } from "@renderer/lib/utils"
import { LoginModalContent } from "@renderer/modules/auth/LoginModalContent"
import { usePresentUserProfileModal } from "@renderer/modules/profile/hooks"
import { SettingTabbedSegment } from "@renderer/modules/settings/control"
import { useSettingModal } from "@renderer/modules/settings/modal/hooks"
import { useSession } from "@renderer/queries/auth"
import type { FC } from "react"
import { memo } from "react"
import { Link } from "react-router-dom"

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
  const Content = (
    <ActionButton
      className="relative z-[1]"
      onClick={
        method === "modal" ?
            () => {
              modalStack.present({
                CustomModalComponent: NoopChildren,
                title: "Login",
                id: "login",
                content: () => (
                  <LoginModalContent
                    runtime={window.electron ? "app" : "browser"}
                  />
                ),
                clickOutsideToDismiss: true,
              })
            } :
          undefined
      }
      tooltip="Login"
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
  if (status !== "authenticated") {
    return <LoginButton {...props} />
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className="!outline-none focus-visible:bg-theme-item-hover"
      >
        <ActionButton tooltip="Profile">
          <UserAvatar className="h-5 p-0 [&_*]:border-0" hideName />
        </ActionButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[180px]" side="bottom" align="end">
        <DropdownMenuLabel className="text-xs text-theme-foreground/60">
          Account
        </DropdownMenuLabel>
        <DropdownMenuLabel>
          <div className="-mt-1 flex items-center gap-2">
            <UserAvatar className="h-7 shrink-0 p-0" hideName />
            <div className="max-w-40 leading-none">
              <div className="truncate">{user?.name}</div>
              <div className="truncate text-xs font-medium text-zinc-500">
                {user?.handle}
              </div>
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
          Profile
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        <DropdownMenuLabel>
          <AppTheme />
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => {
            // Here we need to delay one frame, so it's two raf,
            //  in order to have `point-event: none` recorded by RadixOverlay after modal is invoked in a certain scenario,
            // and the page freezes after modal is turned off.
            nextFrame(() => settingModalPresent("wallet"))
          }}
          icon={<i className="i-mgc-power-outline" />}
        >
          Power
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            nextFrame(settingModalPresent)
          }}
          icon={<i className="i-mgc-settings-7-cute-re" />}
        >
          Preferences
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
              Download Desktop app
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem
          onClick={signOut}
          icon={<i className="i-mgc-exit-cute-re" />}
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
})
ProfileButton.displayName = "ProfileButton"

export function UserAvatar({
  className,
  hideName,
  userId,
  ...props
}: {
  className?: string
  hideName?: boolean
  userId?: string
} & LoginProps) {
  const { session, status } = useSession({
    enabled: !userId,
  })

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
    >
      <Avatar className="aspect-square h-full w-auto overflow-hidden rounded-full border bg-stone-300">
        <AvatarImage
          className="duration-200 animate-in fade-in-0"
          src={(profile.data || session?.user)?.image || undefined}
        />
        <AvatarFallback>
          {(profile.data || session?.user)?.name?.slice(0, 2)}
        </AvatarFallback>
      </Avatar>
      {!hideName && <div>{(profile.data || session?.user)?.name}</div>}
    </div>
  )
}

const AppTheme = () => {
  const theme = useThemeAtomValue()
  const setTheme = useSetTheme()
  return (
    <SettingTabbedSegment
      className="mb-0"
      label={(
        <span>
          <i className="i-mgc-palette-cute-re mr-2 translate-y-0.5" />
          <span className="text-sm font-normal">
            Theme
          </span>
        </span>
      )}
      value={theme}
      values={[
        {
          value: "system",
          label: "",
          icon: <i className="i-mingcute-monitor-line" />,
        },
        {
          value: "light",
          label: "",
          icon: <i className="i-mingcute-sun-line" />,
        },
        {
          value: "dark",
          label: "",
          icon: <i className="i-mingcute-moon-line" />,
        },
      ]}
      onValueChanged={(value) => {
        setTheme(value as "light" | "dark" | "system")
      }}
    />
  )
}
