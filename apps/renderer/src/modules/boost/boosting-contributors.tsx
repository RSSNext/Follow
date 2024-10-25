import { Avatar, AvatarFallback, AvatarImage } from "@follow/components/ui/avatar/index.js"
import { m } from "framer-motion"

import { replaceImgUrlIfNeed } from "~/lib/img-proxy"
import { useFeedBoostersQuery } from "~/modules/boost/query"

import { usePresentUserProfileModal } from "../profile/hooks"

export const BoostingContributors = ({ feedId }: { feedId: string }) => {
  const { data: boosters, isLoading } = useFeedBoostersQuery(feedId)
  const presentUserProfile = usePresentUserProfileModal("drawer")
  if (isLoading || !boosters || boosters.length === 0) return

  return (
    <m.div
      className="overflow-hidden p-4"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <h2 className="mb-4 text-2xl font-bold">Boosting Contributors</h2>
      <ul className="space-y-4">
        {boosters
          .map((user) => (
            <li
              key={user.id}
              role="button"
              className="flex items-center space-x-4"
              onClick={() => presentUserProfile(user.id)}
            >
              <Avatar className="block aspect-square size-10 overflow-hidden rounded-full border border-border ring-1 ring-background">
                <AvatarImage src={replaceImgUrlIfNeed(user?.image || undefined)} />
                <AvatarFallback>{user.name?.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold">{user.name || user.handle}</div>
                {user.handle && <div className="text-xs text-gray-500">@{user.handle}</div>}
              </div>
            </li>
          ))
          // TODO use grid layout when there are many boosters
          .slice(0, 10)}
      </ul>
    </m.div>
  )
}
