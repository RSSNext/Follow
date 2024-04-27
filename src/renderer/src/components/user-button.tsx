import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@renderer/components/ui/avatar"
import { useSession } from "@hono/auth-js/react"
import { cn } from "@renderer/lib/utils"

export function UserButton({ className }: { className?: string }) {
  const { data: session, status } = useSession()

  if (status !== "authenticated") {
    return (
      <div className="flex items-center gap-2">
        <i className="i-mingcute-emoji-2-line text-xl" />
        <span className="text-lg">Log in</span>
      </div>
    )
  }

  return (
    <div className={cn("h-20 flex items-center gap-2", className)}>
      <Avatar className="w-auto h-full aspect-square">
        <AvatarImage src={session?.user?.image || undefined} />
        <AvatarFallback>{session?.user?.name?.slice(0, 2)}</AvatarFallback>
      </Avatar>
      <div>{session?.user?.name}</div>
    </div>
  )
}
