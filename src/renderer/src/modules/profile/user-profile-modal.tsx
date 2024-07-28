import { getSidebarActiveView } from "@renderer/atoms/sidebar"
import { m } from "@renderer/components/common/Motion"
import { FeedIcon } from "@renderer/components/feed-icon"
import { FollowIcon } from "@renderer/components/icons/follow"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@renderer/components/ui/avatar"
import { StyledButton } from "@renderer/components/ui/button"
import { LoadingCircle } from "@renderer/components/ui/loading"
import { useCurrentModal, useModalStack } from "@renderer/components/ui/modal"
import { useAuthQuery } from "@renderer/hooks/common"
import { apiClient } from "@renderer/lib/api-fetch"
import { defineQuery } from "@renderer/lib/defineQuery"
import { nextFrame } from "@renderer/lib/dom"
import type { FeedViewType } from "@renderer/lib/enum"
import { cn } from "@renderer/lib/utils"
import { useUserSubscriptionsQuery } from "@renderer/modules/profile/hooks"
import { useAnimationControls } from "framer-motion"
import type { FC } from "react"
import { Fragment, useEffect, useState } from "react"

import { FeedForm } from "../discover/feed-form"

export const UserProfileModalContent: FC<{
  userId: string
}> = ({ userId }) => {
  const user = useAuthQuery(
    defineQuery(["profiles", userId], async () => {
      const res = await apiClient.profiles.$get({
        query: { id: userId! },
      })
      return res.data
    }),
  )

  const subscriptions = useUserSubscriptionsQuery(user.data?.id)
  const modal = useCurrentModal()
  const controller = useAnimationControls()
  useEffect(() => {
    nextFrame(() => controller.start("enter"))
  }, [controller])

  const { present } = useModalStack()
  const winHeight = useState(() => window.innerHeight)[0]

  return (
    <div className="container center h-full" onClick={modal.dismiss}>
      <m.div
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
        initial="initial"
        animate={controller}
        variants={{
          enter: {
            y: 0,
            opacity: 1,
          },
          initial: {
            y: "100%",
            opacity: 0.9,
          },
          exit: {
            y: winHeight,
          },
        }}
        transition={{
          type: "spring",

          mass: 0.4,
          tension: 100,
          friction: 1,
        }}
        exit="exit"
        className="shadow-perfect perfect-sm relative flex max-h-[80vh] flex-col items-center overflow-hidden rounded-xl border bg-theme-background p-8"
      >
        <button
          className="absolute right-2 top-2 z-10 p-2"
          onClick={modal.dismiss}
          type="button"
          aria-label="close profile"
        >
          <i className="i-mgc-close-cute-re text-[20px] opacity-80 hover:to-theme-button-hover" />
        </button>
        {user.data && (
          <Fragment>
            <div className="center m-12 flex shrink-0 flex-col">
              <Avatar className="aspect-square size-16">
                <AvatarImage src={user.data.image || undefined} />
                <AvatarFallback>{user.data.name?.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-center">
                <div className="mb-2 mt-4 flex items-center text-2xl font-bold">
                  <h1>{user.data.name}</h1>
                </div>
                <div className="mb-8 text-sm text-zinc-500">
                  {user.data.handle}
                </div>
              </div>
            </div>
            <div className="mb-4 h-full w-[70ch] max-w-full space-y-10 overflow-auto px-5">
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
                          <div className="absolute right-0 opacity-0 transition-opacity group-hover:opacity-100">
                            <StyledButton
                              onClick={(e) => {
                                e.stopPropagation()
                                e.preventDefault()
                                const defaultView =
                                  getSidebarActiveView() as FeedViewType

                                present({
                                  title: "Add follow",
                                  content: ({ dismiss }) => (
                                    <FeedForm
                                      asWidget
                                      url={subscription.feeds.url}
                                      defaultView={defaultView}
                                      onSuccess={dismiss}
                                    />
                                  ),
                                })
                              }}
                            >
                              <FollowIcon className="mr-1 size-3" />
                              {APP_NAME}
                            </StyledButton>
                          </div>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Fragment>
        )}

        {!user.data && (
          <LoadingCircle size="large" className="center h-48 w-[46.125rem] max-w-full" />
        )}
      </m.div>
    </div>
  )
}
