import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@renderer/components/ui/avatar"
import { cn } from "@renderer/lib/utils"
import { useSession } from "@renderer/queries/auth"
import { Link } from "react-router-dom"

import { UserArrowLeftIcon } from "./icons/user"
import { ActionButton } from "./ui/button"

export const ProfileButton = () => {
  const { status } = useSession()

  if (status !== "authenticated") {
    return (
      <Link to="/login" className="relative z-[1]">
        <ActionButton tooltip="Login">
          <UserArrowLeftIcon className="size-4" />
        </ActionButton>
      </Link>
    )
  }
  return (
    <Link to="/profile">
      <ActionButton tooltip="Profile">
        <UserButton className="h-5 p-0" hideName />
      </ActionButton>
    </Link>
  )
}

export function UserButton({
  className,
  hideName,
}: {
  className?: string
  hideName?: boolean
}) {
  const { session, status } = useSession()

  if (status !== "authenticated") {
    return (
      <Link to="/login" className="relative z-[1]">
        <ActionButton tooltip="Login">
          <UserArrowLeftIcon className="size-4" />
        </ActionButton>
      </Link>
    )
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
