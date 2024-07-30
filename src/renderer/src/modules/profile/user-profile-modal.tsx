import { env } from "@env"
import { getSidebarActiveView } from "@renderer/atoms/sidebar"
import { m } from "@renderer/components/common/Motion"
import { FeedIcon } from "@renderer/components/feed-icon"
import { FollowIcon } from "@renderer/components/icons/follow"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@renderer/components/ui/avatar"
import { ActionButton, StyledButton } from "@renderer/components/ui/button"
import { LoadingCircle } from "@renderer/components/ui/loading"
import { useCurrentModal, useModalStack } from "@renderer/components/ui/modal"
import { ScrollArea } from "@renderer/components/ui/scroll-area"
import { useAuthQuery } from "@renderer/hooks/common"
import { apiClient } from "@renderer/lib/api-fetch"
import { defineQuery } from "@renderer/lib/defineQuery"
import { nextFrame } from "@renderer/lib/dom"
import type { FeedViewType } from "@renderer/lib/enum"
import { cn } from "@renderer/lib/utils"
import type { SubscriptionModel } from "@renderer/models"
import { useUserSubscriptionsQuery } from "@renderer/modules/profile/hooks"
import { useSubscriptionStore } from "@renderer/store/subscription"
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

  const winHeight = useState(() => window.innerHeight)[0]

  const [scrollerRef, setScrollerRef] = useState<HTMLDivElement | null>(null)

  const [isHeaderSimple, setHeaderSimple] = useState(false)

  useEffect(() => {
    const $ref = scrollerRef

    if (!$ref) return
    $ref.onscroll = () => {
      const currentH = $ref.scrollTop

      setHeaderSimple(currentH > 300)
    }
    return () => {
      $ref.onscroll = null
    }
  }, [scrollerRef])

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
        layout="size"
        className="shadow-perfect perfect-sm relative flex h-[80vh] flex-col items-center overflow-hidden rounded-xl border bg-theme-background p-8 lg:max-h-[calc(100vh-20rem)]"
      >
        <div className="absolute right-2 top-2 z-10 flex items-center gap-2 text-[20px] opacity-80">
          <ActionButton
            tooltip="Share"
            onClick={() => {
              window.open(`${env.VITE_WEB_URL}/profile/${user.data?.id}`)
            }}
          >
            <i className="i-mgc-share-3-cute-re" />
          </ActionButton>
          <ActionButton tooltip="Close" onClick={modal.dismiss}>
            <i className="i-mgc-close-cute-re" />
          </ActionButton>
        </div>

        {user.data && (
          <Fragment>
            <div
              className={cn(
                "center m-12 mb-4 flex shrink-0 flex-col",
                isHeaderSimple ? "mt-3 flex-row" : "flex-col",
              )}
            >
              <Avatar
                asChild
                className={cn(
                  "aspect-square",
                  isHeaderSimple ? "size-12" : "size-16",
                )}
              >
                <m.span layout>
                  <AvatarImage asChild src={user.data.image || undefined}>
                    <m.img layout />
                  </AvatarImage>
                  <AvatarFallback>{user.data.name?.slice(0, 2)}</AvatarFallback>
                </m.span>
              </Avatar>
              <m.div
                layout
                className={cn(
                  "flex flex-col items-center",
                  isHeaderSimple ? "ml-8 items-start" : "",
                )}
              >
                <m.div
                  className={cn(
                    "mb-1 flex items-center text-2xl font-bold",
                    isHeaderSimple ? "" : "mt-4",
                  )}
                >
                  <m.h1 layout>{user.data.name}</m.h1>
                </m.div>
                {!!user.data.handle && (
                  <m.div className="mb-0 text-sm text-zinc-500" layout>
                    @
                    {user.data.handle}
                  </m.div>
                )}
              </m.div>
            </div>
            <ScrollArea.ScrollArea
              mask
              ref={setScrollerRef}
              rootClassName="mb-4 h-[400px] grow w-[70ch] max-w-full px-5"
              viewportClassName="[&>div]:space-y-4"
            >
              {subscriptions.isLoading ? (
                <LoadingCircle
                  size="large"
                  className="center h-48 w-full max-w-full"
                />
              ) : (
                subscriptions.data &&
                Object.keys(subscriptions.data).map((category) => (
                  <div key={category}>
                    <div className="mb-2 flex items-center text-2xl font-bold">
                      <h3>{category}</h3>
                    </div>
                    <div>
                      {subscriptions.data?.[category].map((subscription) => (
                        <SubscriptionItem
                          key={subscription.feedId}
                          subscription={subscription}
                        />
                      ))}
                    </div>
                  </div>
                ))
              )}
            </ScrollArea.ScrollArea>
          </Fragment>
        )}

        {!user.data && (
          <LoadingCircle
            size="large"
            className="center h-[80vh] w-[39.125rem] max-w-full"
          />
        )}
      </m.div>
    </div>
  )
}

const SubscriptionItem: FC<{
  subscription: SubscriptionModel
}> = ({ subscription }) => {
  const isFollowed = !!useSubscriptionStore(
    (state) => state.data[subscription.feedId],
  )
  const { present } = useModalStack()
  return (
    <div className="group relative border-b py-5">
      <a
        className="flex flex-1 cursor-default"
        href={subscription.feeds.siteUrl!}
        target="_blank"
      >
        <FeedIcon feed={subscription.feeds} size={22} className="mr-3" />
        <div className={cn("w-0 flex-1 grow", "group-hover:grow-[0.85]")}>
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
              const defaultView = getSidebarActiveView() as FeedViewType

              present({
                title: `${isFollowed ? "Edit " : ""}${APP_NAME} - ${
                  subscription.feeds.title
                }`,
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
            {isFollowed ? "Edit" : APP_NAME}
          </StyledButton>
        </div>
      </a>
    </div>
  )
}
