import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@renderer/components/ui/avatar"
import { useSession } from "@hono/auth-js/react"
import { cn } from "@renderer/lib/utils"

export function UserButton({
  className,
  hideName,
}: {
  className?: string
  hideName?: boolean
}) {
  const { data: session, status } = useSession()

  if (status !== "authenticated") {
    return null
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
