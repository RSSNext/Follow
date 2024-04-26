import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@renderer/components/ui/avatar"
import { useSession } from "@hono/auth-js/react"

export function UserButton() {
  const { data: session, status } = useSession()

  if (status !== "authenticated") {
    return null
  }

  return (
    <Avatar className="size-20">
      <AvatarImage src={session?.user?.image || undefined} />
      <AvatarFallback>{session?.user?.name}</AvatarFallback>
    </Avatar>
  )
}
