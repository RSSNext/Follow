import { forwardRef } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { useAuthQuery } from "~/hooks/common"
import { apiClient } from "~/lib/api-fetch"
import { defineQuery } from "~/lib/defineQuery"
import { replaceImgUrlIfNeed } from "~/lib/img-proxy"
import { cn } from "~/lib/utils"
import { usePresentUserProfileModal } from "~/modules/profile/hooks"
import { useSession } from "~/queries/auth"

import type { LoginProps } from "./LoginButton"
import { LoginButton } from "./LoginButton"

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
