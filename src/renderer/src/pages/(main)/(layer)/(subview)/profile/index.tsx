import { useUser } from "@renderer/atoms/user"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@renderer/components/ui/avatar"
import { StyledButton } from "@renderer/components/ui/button"
import { useSignOut } from "@renderer/hooks"
import { views } from "@renderer/lib/constants"
import { cn } from "@renderer/lib/utils"
import { FeedList } from "@renderer/modules/feed-column/list"

export function Component() {
  const user = useUser()
  const signOut = useSignOut()
  return (
    <div className="flex w-full gap-10 px-10 py-16">
      <div className="flex min-w-40 flex-1 flex-col items-center gap-8 pt-20">
        <Avatar className="aspect-square size-32">
          <AvatarImage src={user?.image || undefined} />
          <AvatarFallback>{user?.name?.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="text-4xl font-bold">{user?.name}</div>

        <div>
          <StyledButton
            variant="plain"
            onClick={() => {
              signOut()
            }}
          >
            Sign out
          </StyledButton>
        </div>
      </div>

      <div className="flex flex-[2] flex-col gap-8">
        <div className="flex h-full flex-col gap-4">
          <div className="text-2xl font-bold">Subscriptions</div>
          <div className="overflow-y-auto">
            {views.map((view, index) => (
              <div key={view.name}>
                <div className="mb-1 flex items-center gap-2 font-semibold">
                  <span className={cn("flex", view.className)}>
                    {view.icon}
                  </span>
                  <span>{view.name}</span>
                </div>
                <FeedList
                  key={view.name}
                  className="mb-4"
                  view={index}
                  hideTitle
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
