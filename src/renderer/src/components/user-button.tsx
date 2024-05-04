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
        "h-20 flex items-center gap-2 justify-center py-2 px-5 rounded-xl font-medium cursor-pointer bg-stone-300 text-zinc-600",
        className,
      )}
    >
      <Avatar className="w-auto h-full aspect-square">
        <AvatarImage src={session?.user?.image || undefined} />
        <AvatarFallback>{session?.user?.name?.slice(0, 2)}</AvatarFallback>
      </Avatar>
      {!hideName && <div>{session?.user?.name}</div>}
    </div>
  )
}
