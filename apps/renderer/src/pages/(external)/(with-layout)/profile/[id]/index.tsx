import { Fragment } from "react/jsx-runtime"
import { useParams } from "react-router-dom"

import { useWhoami } from "~/atoms/user"
import { PoweredByFooter } from "~/components/common/PoweredByFooter"
import { FeedIcon } from "~/components/feed-icon"
import { FollowIcon } from "~/components/icons/follow"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Button } from "~/components/ui/button"
import { LoadingCircle } from "~/components/ui/loading"
import { usePresentFeedFormModal } from "~/hooks/biz/useFeedFormModal"
import { useAuthQuery, useI18n, useTitle } from "~/hooks/common"
import { apiClient } from "~/lib/api-fetch"
import { defineQuery } from "~/lib/defineQuery"
import { replaceImgUrlIfNeed } from "~/lib/img-proxy"
import { cn, isBizId } from "~/lib/utils"
import { useUserSubscriptionsQuery } from "~/modules/profile/hooks"

export function Component() {
  const t = useI18n()
  const { id } = useParams()

  const isHandle = id ? id.startsWith("@") || !isBizId(id) : false
  const user = useAuthQuery(
    defineQuery(["profiles", id], async () => {
      const res = await apiClient.profiles.$get({
        query: {
          handle: isHandle ? (id?.startsWith("@") ? id.slice(1) : id) : undefined,
          id: isHandle ? undefined : id,
        },
      })
      return res.data
    }),
    {
      enabled: !!id,
    },
  )

  const subscriptions = useUserSubscriptionsQuery(user.data?.id)
  useTitle(user.data?.name)
  const me = useWhoami()
  const isMe = user.data?.id === me?.id
  const presentFeedFormModal = usePresentFeedFormModal()

  return (
    <div className="container mx-auto mt-12 flex grow flex-col items-center p-4 lg:p-0">
      {user.isLoading ? (
        <LoadingCircle size="large" className="center fixed inset-0" />
      ) : (
        <Fragment>
          <Avatar className="aspect-square size-16">
            <AvatarImage
              className="duration-200 animate-in fade-in-0"
              src={replaceImgUrlIfNeed(user.data?.image || undefined)}
            />
            <AvatarFallback>{user.data?.name?.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center">
            <div className="mb-2 mt-4 flex items-center text-2xl font-bold">
              <h1>{user.data?.name}</h1>
            </div>
            <div className="mb-8 text-sm text-zinc-500">{user.data?.handle}</div>
          </div>
          <div
            className="mb-12 w-[70ch] max-w-full grow space-y-10"
            data-testid="profile-subscriptions"
          >
            {subscriptions.isLoading ? (
              <LoadingCircle size="large" className="center fixed inset-0" />
            ) : (
              Object.keys(subscriptions.data || {}).map((category) => (
                <div key={category}>
                  <div className="mb-4 flex items-center text-2xl font-bold">
                    <h3>{category}</h3>
                  </div>
                  <div>
                    {subscriptions.data?.[category].map(
                      (subscription) =>
                        "feeds" in subscription && (
                          <div key={subscription.feedId} className="group relative border-b py-5">
                            <a
                              className="flex flex-1 cursor-button"
                              href={`/feed/${subscription.feedId}`}
                              target="_blank"
                            >
                              <FeedIcon
                                fallback
                                feed={subscription.feeds}
                                size={22}
                                className="mr-3"
                              />
                              <div
                                className={cn(
                                  "flex w-0 flex-1 grow flex-col justify-center",
                                  "group-hover:grow-[0.85]",
                                )}
                              >
                                <div className="truncate font-medium leading-none">
                                  {subscription.feeds?.title}
                                </div>
                                {subscription.feeds?.description && (
                                  <div className="mt-1 line-clamp-1 text-xs text-zinc-500">
                                    {subscription.feeds.description}
                                  </div>
                                )}
                              </div>
                            </a>
                            <span className="center absolute inset-y-0 right-0 opacity-0 transition-opacity group-hover:opacity-100">
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation()

                                  presentFeedFormModal({
                                    feedId: subscription.feedId,
                                  })
                                }}
                              >
                                {isMe ? (
                                  t.common("words.edit")
                                ) : (
                                  <>
                                    <FollowIcon className="mr-1 size-3" />
                                    {APP_NAME}
                                  </>
                                )}
                              </Button>
                            </span>
                          </div>
                        ),
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          <PoweredByFooter className="pb-12" />
        </Fragment>
      )}
    </div>
  )
}
