import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@renderer/components/ui/avatar"
import { useSignOut } from "@renderer/hooks"
import { nextFrame } from "@renderer/lib/dom"
import { cn } from "@renderer/lib/utils"
import { LoginModalContent } from "@renderer/modules/auth/LoginModalContent"
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
                content: () => <LoginModalContent runtime={window.electron ? "app" : "browser"} />,
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
  if (status !== "authenticated") {
    return <LoginButton {...props} />
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="!outline-none focus-visible:bg-theme-item-hover">
        <ActionButton as="div" tooltip="Profile">
          <UserAvatar className="h-5 p-0" hideName />
        </ActionButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[180px]" side="bottom" align="end">
        <DropdownMenuLabel className="text-xs text-theme-foreground/60">
          Account
        </DropdownMenuLabel>
        <DropdownMenuLabel>
          <div className="-mt-2 flex items-center justify-between">
            <span className="">{user?.name}</span>
            <UserAvatar className="h-5 shrink-0 p-0" hideName />
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            // Here we need to delay one frame, so it's two raf,
            //  in order to have `point-event: none` recorded by RadixOverlay after modal is invoked in a certain scenario,
            // and the page freezes after modal is turned off.
            nextFrame(() => settingModalPresent("wallet"))
          }}
        >
          Power
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            nextFrame(settingModalPresent)
          }}
        >
          Preferences
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {!window.electron && (
          <>
            <DropdownMenuItem
              onClick={() => {
                // TODO
              }}
            >
              Download Desktop app
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem onClick={signOut}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
})
ProfileButton.displayName = "ProfileButton"

export function UserAvatar({
  className,
  hideName,
  ...props
}: {
  className?: string
  hideName?: boolean
} & LoginProps) {
  const { session, status } = useSession()

  if (status !== "authenticated") {
    return <LoginButton {...props} />
  }

  return (
    <div
      className={cn(
        "flex h-20 items-center justify-center gap-2 rounded-xl bg-stone-300 px-5 py-2 font-medium text-zinc-600",
        className,
      )}
    >
      <Avatar className="aspect-square h-full w-auto">
        <AvatarImage src={session?.user?.image || undefined} />
        <AvatarFallback>{session?.user?.name?.slice(0, 2)}</AvatarFallback>
      </Avatar>
      {!hideName && <div>{session?.user?.name}</div>}
    </div>
  )
}
