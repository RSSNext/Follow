import { useSession } from "@hono/auth-js/react"
import { FeedList } from "@renderer/components/feed-column/list"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@renderer/components/ui/avatar"
import { views } from "@renderer/lib/constants"

export function Component() {
  const { data: session } = useSession()

  return (
    <div className="flex gap-10 w-full px-10 py-16">
      <div className="flex flex-col gap-8 flex-1 pt-20 min-w-40">
        <Avatar className="w-32 h-32 aspect-square">
          <AvatarImage src={session?.user?.image || undefined} />
          <AvatarFallback>{session?.user?.name?.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="font-bold text-4xl">{session?.user?.name}</div>
      </div>
      <div className="flex-[2] flex flex-col gap-8">
        <div className="h-full flex flex-col gap-4">
          <div className="font-bold text-2xl">Subscriptions</div>
          <div className="overflow-y-auto">
            {views.map((view, index) => (
              <>
                <div className="font-medium flex items-center gap-2 mb-1">
                  {view.icon}
                  {view.name}
                </div>
                <FeedList
                  key={index}
                  className="mb-4"
                  view={index}
                  hideTitle={true}
                />
              </>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
