import { Avatar, AvatarFallback, AvatarImage } from "@follow/components/ui/avatar/index.jsx"
import { cn } from "@follow/utils/utils"
import { forwardRef } from "react"

import { useAuthQuery } from "~/hooks/common"
import { apiClient } from "~/lib/api-fetch"
import { defineQuery } from "~/lib/defineQuery"
import { replaceImgUrlIfNeed } from "~/lib/img-proxy"
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
  } & LoginProps &
    React.HTMLAttributes<HTMLDivElement>
>(
  (
    { className, avatarClassName, hideName, userId, enableModal, style, onClick, ...props },
    ref,
  ) => {
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
        onClick={(e) => {
          if (enableModal) {
            presentUserProfile(userId)
          }
          onClick?.(e)
        }}
        {...props}
        className={cn(
          "flex h-20 items-center justify-center gap-2 px-5 py-2 font-medium text-zinc-600 dark:text-zinc-300",
          className,
        )}
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
  },
)

UserAvatar.displayName = "UserAvatar"
