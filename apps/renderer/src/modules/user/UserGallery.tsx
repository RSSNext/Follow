import { Avatar, AvatarFallback, AvatarImage } from "@follow/components/ui/avatar/index.jsx"
import { getColorScheme, stringToHue } from "@follow/utils/color"

import { replaceImgUrlIfNeed } from "~/lib/img-proxy"
import { usePresentUserProfileModal } from "~/modules/profile/hooks"

import type { User } from "./utils"

interface UserGalleryProps {
  users: User[]
  dedupe?: boolean
  limit?: number
}

export const UserGallery = ({ users, limit = 18 }: UserGalleryProps) => {
  const displayedUsers = users.slice(0, limit)

  return (
    <div className="mx-auto flex w-fit max-w-80 flex-wrap gap-4">
      {displayedUsers.map((user) => (
        <div key={user.id} className="size-8">
          <UserAvatar user={user} />
        </div>
      ))}
    </div>
  )
}

const UserAvatar: Component<{
  user: User | null
}> = ({ user }) => {
  const presentUserProfile = usePresentUserProfileModal("drawer")
  const randomColor = stringToHue(user?.name || "")
  if (!user) return null
  return (
    <Avatar
      onClick={() => {
        presentUserProfile(user.id)
      }}
      className="aspect-square size-8 h-full w-auto overflow-hidden rounded-full border bg-stone-300"
    >
      <AvatarImage
        src={replaceImgUrlIfNeed(user?.image || undefined)}
        className="duration-200 animate-in fade-in-0"
      />
      <AvatarFallback
        style={{ backgroundColor: getColorScheme(randomColor, true).light.accent }}
        className="text-xs text-white"
      >
        {user?.name?.[0]}
      </AvatarFallback>
    </Avatar>
  )
}
