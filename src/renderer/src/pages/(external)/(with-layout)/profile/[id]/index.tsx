import { FeedIcon } from "@renderer/components/feed-icon"
import { FollowIcon } from "@renderer/components/icons/follow"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@renderer/components/ui/avatar"
import { StyledButton } from "@renderer/components/ui/button"
import { useAuthQuery, useTitle } from "@renderer/hooks/common"
import { apiClient } from "@renderer/lib/api-fetch"
import { defineQuery } from "@renderer/lib/defineQuery"
import { capitalizeFirstLetter, cn } from "@renderer/lib/utils"
import { DEEPLINK_SCHEME } from "@shared/constants"
import { useParams } from "react-router-dom"
import { parse } from "tldts"

export function Component() {
  const { id } = useParams()

  const user = useAuthQuery(
    defineQuery(["profiles", id], async () => {
      const res = await apiClient.profiles.$get({
        query: { id: id! },
      })
      return res.data
    }),
    {
      enabled: !!id,
    },
  )

  const subscriptions = useAuthQuery(
    defineQuery(["subscriptions", user.data?.id], async () => {
      const res = await apiClient.subscriptions.$get({
        query: { userId: user.data?.id },
      })
      const groupFolder = {} as Record<string, typeof res.data>

      for (const subscription of res.data || []) {
        if (!subscription.category && subscription.feeds) {
          const { siteUrl } = subscription.feeds
          if (!siteUrl) continue
          const parsed = parse(siteUrl)
          parsed.domain &&
          (subscription.category = capitalizeFirstLetter(parsed.domain))
        }
        if (subscription.category) {
          if (!groupFolder[subscription.category]) {
            groupFolder[subscription.category] = []
          }
          groupFolder[subscription.category].push(subscription)
        }
      }

      return groupFolder
    }),
    {
      enabled: !!user.data?.id,
    },
  )
  useTitle(user.data?.name)
  return (
    <>
      {user.data && (
        <div className="container mx-auto mt-12 flex flex-col items-center justify-center p-4 lg:p-0">
          <Avatar className="aspect-square size-16">
            <AvatarImage src={user.data.image || undefined} />
            <AvatarFallback>{user.data.name?.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center">
            <div className="mb-2 mt-4 flex items-center text-2xl font-bold">
              <h1>{user.data.name}</h1>
            </div>
            <div className="mb-8 text-sm text-zinc-500">{user.data.handle}</div>
          </div>
          <div className="mb-12 w-[70ch] max-w-full space-y-10">
            {Object.keys(subscriptions.data || {}).map((category) => (
              <div key={category}>
                <div className="mb-4 flex items-center text-2xl font-bold">
                  <h3>{category}</h3>
                </div>
                <div>
                  {subscriptions.data?.[category].map((subscription) => (
                    <div
                      key={subscription.feedId}
                      className="group relative border-b py-5"
                    >
                      <a
                        className="flex flex-1 cursor-default"
                        href={subscription.feeds.siteUrl!}
                        target="_blank"
                      >
                        <FeedIcon
                          feed={subscription.feeds}
                          size={22}
                          className="mr-3"
                        />
                        <div
                          className={cn(
                            "w-0 flex-1 grow",
                            "group-hover:grow-[0.85]",
                          )}
                        >
                          <div className="truncate font-medium leading-none">
                            {subscription.feeds?.title}
                          </div>
                          <div className="mt-1 line-clamp-1 text-xs text-zinc-500">
                            {subscription.feeds?.description}
                          </div>
                        </div>

                        <a
                          className="absolute right-0 opacity-0 transition-opacity group-hover:opacity-100"
                          href={`${DEEPLINK_SCHEME}#add?id=${subscription.feeds?.id}`}
                        >
                          <StyledButton>
                            <FollowIcon className="mr-1 size-3" />
                            {APP_NAME}
                          </StyledButton>
                        </a>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
