import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@renderer/components/ui/avatar"
import { useSignOut } from "@renderer/hooks"
import { loginHandler } from "@renderer/lib/auth"
import { APP_NAME } from "@renderer/lib/constants"
import { nextFrame, stopPropagation } from "@renderer/lib/dom"
import { cn } from "@renderer/lib/utils"
import { useSettingModal } from "@renderer/modules/settings/modal/hooks"
import { useSession } from "@renderer/queries/auth"
import { m } from "framer-motion"
import type { FC } from "react"
import { memo } from "react"
import { Link } from "react-router-dom"

import { FollowIcon } from "./icons/follow"
import { UserArrowLeftIcon } from "./icons/user"
import { ActionButton, Button } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu/dropdown-menu"
import { useCurrentModal } from "./ui/modal"
import { modalMontionConfig } from "./ui/modal/stacked/constants"
import { useModalStack } from "./ui/modal/stacked/hooks"

const LoginModalContent = () => {
  const modal = useCurrentModal()
  return (
    <div className="center flex h-full" onClick={modal.dismiss}>
      <m.div
        className="shadow-modal rounded-lg border border-border bg-theme-background p-4 px-8 pb-8"
        onClick={stopPropagation}
        {...modalMontionConfig}
      >
        <div className="mb-8 mt-4 text-center align-middle font-sans text-2xl font-bold leading-relaxed">
          <span className="text-xl">Sign in to </span>
          <span className="center flex translate-y-px gap-2 font-theme text-theme-accent">
            <FollowIcon className="size-4" />
            {APP_NAME}
          </span>
        </div>
        <div className="flex flex-col gap-4">
          <Button
            className="h-[48px] w-[320px] rounded-[8px] !bg-black font-sans text-base text-white hover:!bg-black/80"
            size="lg"
            onClick={() => {
              loginHandler("github")
            }}
          >
            <i className="i-mgc-github-cute-fi mr-2 text-xl" />
            {" "}
            Continue with
            GitHub
          </Button>
          <Button
            className="h-[48px] w-[320px] rounded-[8px] bg-blue-500 font-sans text-base text-white hover:bg-blue-500/90"
            size="xl"
            onClick={() => {
              loginHandler("google")
            }}
          >
            <i className="i-mgc-google-cute-fi mr-2 text-xl" />
            {" "}
            Continue with
            Google
          </Button>
        </div>
      </m.div>
    </div>
  )
}

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
                CustomModalComponent: ({ children }) => children,
                title: "Login",
                content: LoginModalContent,
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
