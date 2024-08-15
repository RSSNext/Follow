import { env } from "@env"
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
import { nextFrame, stopPropagation } from "@renderer/lib/dom"
import { cn } from "@renderer/lib/utils"
import type { SubscriptionModel } from "@renderer/models"
import { useUserSubscriptionsQuery } from "@renderer/modules/profile/hooks"
import { useSubscriptionStore } from "@renderer/store/subscription"
import { useAnimationControls } from "framer-motion"
import { throttle } from "lodash-es"
import type { FC } from "react"
import { Fragment, useEffect, useMemo, useRef, useState } from "react"

import { FeedForm } from "../discover/feed-form"

type ItemVariant = "loose" | "compact"
export const UserProfileModalContent: FC<{
  userId: string

  variant: "drawer" | "dialog"
}> = ({ userId, variant }) => {
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

  const currentVisibleRef = useRef<Set<string>>()
  useEffect(() => {
    const $ref = scrollerRef

    if (!$ref) return

    const initialHeaderHeight = 136
    $ref.onscroll = throttle(() => {
      const currentH = $ref.scrollTop

      setHeaderSimple((current) => {
        if (!current) {
          return currentH > initialHeaderHeight
        } else {
          if (currentH === 0) return false
        }
        return current
      })
    }, 16)

    const currentVisible = new Set<string>()
    const ob = new IntersectionObserver((en) => {
      en.forEach((entry) => {
        const id = (entry.target as HTMLElement).dataset.feedId as string
        if (!id) return
        if (entry.isIntersecting) {
          currentVisible.add(id)
        } else {
          currentVisible.delete(id)
        }
      })

      if (currentVisible.size === 0) return
      currentVisibleRef.current = currentVisible
    })

    $ref.querySelectorAll("[data-feed-id]").forEach((el) => {
      ob.observe(el)
    })
    return () => {
      $ref.onscroll = null

      ob.disconnect()
    }
  }, [scrollerRef, subscriptions])

  const modalVariant = useMemo(() => {
    switch (variant) {
      case "drawer": {
        return {
          enter: {
            x: 0,
            opacity: 1,
          },
          initial: {
            x: 700,
            opacity: 0.9,
          },
          exit: {
            x: 750,
            opacity: 0,
          },
        }
      }

      case "dialog": {
        return {
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
        }
      }
    }
  }, [variant, winHeight])

  const [itemStyle, setItemStyle] = useState("loose" as ItemVariant)

  return (
    <div
      className={variant === "drawer" ? "h-full" : "container center h-full"}
      onPointerDown={variant === "dialog" ? modal.dismiss : undefined}
      onClick={stopPropagation}
    >
      <m.div
        onPointerDown={stopPropagation}
        onPointerDownCapture={stopPropagation}
        tabIndex={-1}
        initial="initial"
        animate={controller}
        variants={modalVariant}
        transition={{
          type: "spring",
          mass: 0.4,
          tension: 100,
          friction: 1,
        }}
        exit="exit"
        layout="size"
        className={cn(
          "relative flex flex-col items-center overflow-hidden rounded-xl border bg-theme-background p-8 pb-0 shadow",
          variant === "drawer" ?
            "h-full w-[60ch] max-w-full" :
            "h-[80vh] w-[800px] max-w-full lg:max-h-[calc(100vh-10rem)]",
        )}
      >
        <div className="absolute right-2 top-2 z-10 flex items-center gap-2 text-[20px] opacity-80">
          <ActionButton
            tooltip="Toggle Item Style"
            onClick={() => {
              const currentVisible = currentVisibleRef.current
              const topOfCurrent = currentVisible?.values().next().value

              setItemStyle((current) =>
                current === "loose" ? "compact" : "loose",
              )
              if (!topOfCurrent) return

              nextFrame(() => {
                scrollerRef
                  ?.querySelector(`[data-feed-id="${topOfCurrent}"]`)
                  ?.scrollIntoView()
              })
            }}
          >
            <i
              className={cn(
                itemStyle === "loose" ?
                  "i-mgc-list-check-3-cute-re" :
                  "i-mgc-list-check-cute-re",
              )}
            />
          </ActionButton>
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
                  "flex cursor-text select-text flex-col items-center",
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
              ref={setScrollerRef}
              rootClassName="h-[400px] grow max-w-full px-5 w-full"
              viewportClassName="[&>div]:space-y-4 pb-4"
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
                          variant={itemStyle}
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

        {!user.data && <LoadingCircle size="large" className="center h-full" />}
      </m.div>
    </div>
  )
}

const SubscriptionItem: FC<{
  subscription: SubscriptionModel

  variant: ItemVariant
}> = ({ subscription, variant }) => {
  const isFollowed = !!useSubscriptionStore(
    (state) => state.data[subscription.feedId],
  )
  const { present } = useModalStack()
  const isLoose = variant === "loose"
  return (
    <div
      className={cn("group relative", isLoose ? "border-b py-5" : "py-2")}
      data-feed-id={subscription.feedId}
    >
      <a
        className="flex flex-1 cursor-default"
        href={subscription.feeds.siteUrl!}
        target="_blank"
      >
        <FeedIcon feed={subscription.feeds} size={22} className="mr-3" />
        <div
          className={cn(
            "w-0 flex-1 grow",
            "group-hover:grow-[0.85]",
            !isLoose && "flex items-center",
          )}
        >
          <div className="truncate font-medium leading-none">
            {subscription.feeds?.title}
          </div>
          {isLoose && (
            <div className="mt-1 line-clamp-1 text-xs text-zinc-500">
              {subscription.feeds?.description}
            </div>
          )}
        </div>
        <div className="absolute right-0 opacity-0 transition-opacity group-hover:opacity-100">
          <StyledButton
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
              const defaultView = subscription.view

              present({
                title: `${isFollowed ? "Edit " : ""}${APP_NAME} - ${
                  subscription.feeds.title
                }`,
                clickOutsideToDismiss: true,
                content: ({ dismiss }) => (
                  <FeedForm
                    asWidget
                    url={subscription.feeds.url}
                    defaultValues={{
                      view: defaultView.toString(),
                      category: subscription.category,
                    }}
                    onSuccess={dismiss}
                  />
                ),
              })
            }}
          >
            {isFollowed ? (
              "Edit"
            ) : (
              <>
                <FollowIcon className="mr-1 size-3" />
                {APP_NAME}
              </>
            )}
          </StyledButton>
        </div>
      </a>
    </div>
  )
}
