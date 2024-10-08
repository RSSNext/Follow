import { env } from "@follow/shared/env"
import { AnimatePresence, useAnimationControls } from "framer-motion"
import { useAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"
import { throttle } from "lodash-es"
import type { FC } from "react"
import { Fragment, memo, useEffect, useMemo, useRef, useState } from "react"
import { useTranslation } from "react-i18next"

import { m } from "~/components/common/Motion"
import { FeedIcon } from "~/components/feed-icon"
import { FollowIcon } from "~/components/icons/follow"
import { AutoResizeHeight } from "~/components/ui/auto-resize-height"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { ActionButton, Button } from "~/components/ui/button"
import { LoadingCircle, LoadingWithIcon } from "~/components/ui/loading"
import { useCurrentModal, useModalStack } from "~/components/ui/modal"
import { ScrollArea } from "~/components/ui/scroll-area"
import { useAuthQuery, useI18n } from "~/hooks/common"
import { apiClient } from "~/lib/api-fetch"
import { defineQuery } from "~/lib/defineQuery"
import { nextFrame, stopPropagation } from "~/lib/dom"
import { replaceImgUrlIfNeed } from "~/lib/img-proxy"
import { getStorageNS } from "~/lib/ns"
import { cn } from "~/lib/utils"
import type { SubscriptionModel } from "~/models"
import { useUserSubscriptionsQuery } from "~/modules/profile/hooks"
import { useSubscriptionStore } from "~/store/subscription"
import { useUserById } from "~/store/user"

import { FeedForm } from "../discover/feed-form"

const itemVariantAtom = atomWithStorage(
  getStorageNS("item-variant"),
  "loose" as ItemVariant,
  undefined,
  {
    getOnInit: true,
  },
)
type ItemVariant = "loose" | "compact"
export const UserProfileModalContent: FC<{
  userId: string

  variant: "drawer" | "dialog"
}> = ({ userId, variant }) => {
  const { t } = useTranslation()
  const user = useAuthQuery(
    defineQuery(["profiles", userId], async () => {
      const res = await apiClient.profiles.$get({
        query: { id: userId! },
      })
      return res.data
    }),
  )
  const storeUser = useUserById(userId)

  const userInfo = user.data
    ? {
        avatar: user.data.image,
        name: user.data.name,
        handle: user.data.handle,
      }
    : storeUser
      ? {
          avatar: storeUser.image,
          name: storeUser.name,
          handle: storeUser.handle,
        }
      : null

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

    const scrollHandler = throttle(() => {
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
    $ref.addEventListener("scroll", scrollHandler)

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
      $ref.removeEventListener("scroll", scrollHandler)

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

  const [itemStyle, setItemStyle] = useAtom(itemVariantAtom)

  return (
    <div
      className={variant === "drawer" ? "h-full" : "container center h-full"}
      onPointerDown={variant === "dialog" ? modal.dismiss : undefined}
      onClick={stopPropagation}
    >
      <m.div
        onPointerDown={stopPropagation}
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
          "relative flex flex-col items-center overflow-hidden rounded-xl border bg-theme-background p-8 pb-0",
          variant === "drawer"
            ? "shadow-drawer-to-left h-full w-[60ch] max-w-full"
            : "h-[80vh] w-[800px] max-w-full shadow lg:max-h-[calc(100vh-10rem)]",
        )}
      >
        <div className="absolute right-2 top-2 z-10 flex items-center gap-2 text-[20px] opacity-80">
          <ActionButton
            tooltip={t("user_profile.toggle_item_style")}
            onClick={() => {
              const currentVisible = currentVisibleRef.current
              const topOfCurrent = currentVisible?.values().next().value

              setItemStyle((current) => (current === "loose" ? "compact" : "loose"))
              if (!topOfCurrent) return

              nextFrame(() => {
                scrollerRef?.querySelector(`[data-feed-id="${topOfCurrent}"]`)?.scrollIntoView()
              })
            }}
          >
            <i
              className={cn(
                itemStyle === "loose" ? "i-mgc-list-check-3-cute-re" : "i-mgc-list-check-cute-re",
              )}
            />
          </ActionButton>
          <ActionButton
            tooltip={t("user_profile.share")}
            onClick={() => {
              window.open(
                `${env.VITE_WEB_URL}/profile/${user.data?.handle ? `@${user.data.handle}` : user.data?.id}`,
              )
            }}
          >
            <i className="i-mgc-share-3-cute-re" />
          </ActionButton>
          <ActionButton tooltip={t("user_profile.close")} onClick={modal.dismiss}>
            <i className="i-mgc-close-cute-re" />
          </ActionButton>
        </div>

        {userInfo && (
          <Fragment>
            <div
              className={cn(
                "center m-12 mb-4 flex shrink-0 flex-col f-motion-reduce:duration-700",
                isHeaderSimple ? "mt-3 flex-row" : "flex-col",
              )}
            >
              <Avatar
                asChild
                className={cn("aspect-square", isHeaderSimple ? "size-12" : "size-16")}
              >
                <m.span layout transition={{ duration: 0.35 }}>
                  <AvatarImage
                    className="duration-200 animate-in fade-in-0"
                    asChild
                    src={replaceImgUrlIfNeed(userInfo.avatar || undefined)}
                  >
                    <m.img layout />
                  </AvatarImage>
                  <AvatarFallback>{userInfo.name?.slice(0, 2)}</AvatarFallback>
                </m.span>
              </Avatar>
              <m.div
                layout
                transition={{ duration: 0.35 }}
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
                  <m.h1 layout>{userInfo.name}</m.h1>
                </m.div>

                <m.div
                  className={cn(
                    "mb-0 text-sm text-zinc-500",
                    userInfo.handle ? "visible" : "hidden select-none",
                  )}
                  layout
                >
                  @{userInfo.handle}
                </m.div>
              </m.div>
            </div>
            <ScrollArea.ScrollArea
              ref={setScrollerRef}
              rootClassName="grow max-w-full px-5 w-full"
              viewportClassName="[&>div]:space-y-4 pb-4"
            >
              {subscriptions.isLoading ? (
                <LoadingWithIcon
                  size="large"
                  icon={
                    <Avatar className="aspect-square size-4">
                      <AvatarImage src={replaceImgUrlIfNeed(userInfo.avatar || undefined)} />
                      <AvatarFallback>{userInfo.name?.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                  }
                  className="center h-48 w-full max-w-full"
                />
              ) : (
                subscriptions.data &&
                Object.keys(subscriptions.data).map((category) => (
                  <SubscriptionGroup
                    key={category}
                    category={category}
                    subscriptions={subscriptions.data?.[category]}
                    itemStyle={itemStyle}
                  />
                ))
              )}
            </ScrollArea.ScrollArea>
          </Fragment>
        )}

        {!userInfo && <LoadingCircle size="large" className="center h-full" />}
      </m.div>
    </div>
  )
}

const SubscriptionGroup: FC<{
  category: string
  subscriptions: SubscriptionModel[]
  itemStyle: ItemVariant
}> = memo(({ category, subscriptions, itemStyle }) => {
  const [isOpened, setIsOpened] = useState(true)
  return (
    <div>
      <button
        onClick={() => setIsOpened(!isOpened)}
        className="mb-2 mt-8 flex w-full items-center justify-between text-2xl font-bold"
        type="button"
      >
        <h3>{category}</h3>

        <div className="inline-flex shrink-0 items-center opacity-50">
          <i
            className={cn("i-mingcute-down-line size-5 duration-200", isOpened ? "rotate-180" : "")}
          />
        </div>
      </button>
      <AutoResizeHeight duration={0.2}>
        <AnimatePresence mode="popLayout">
          {isOpened && (
            <Fragment>
              {subscriptions.map((subscription) => (
                <SubscriptionItem
                  variant={itemStyle}
                  key={subscription.feedId}
                  subscription={subscription}
                />
              ))}
            </Fragment>
          )}
        </AnimatePresence>
      </AutoResizeHeight>
    </div>
  )
})

const SubscriptionItem: FC<{
  subscription: SubscriptionModel

  variant: ItemVariant
}> = ({ subscription, variant }) => {
  const t = useI18n()
  const isFollowed = !!useSubscriptionStore((state) => state.data[subscription.feedId])
  const { present } = useModalStack()
  const isLoose = variant === "loose"
  if (!("feeds" in subscription)) return null
  return (
    <m.div
      exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.2 } }}
      className={cn("group relative", isLoose ? "border-b py-5 last:border-b-0" : "py-2")}
      data-feed-id={subscription.feedId}
    >
      <a
        className="flex flex-1 cursor-menu items-center"
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
          <div className="truncate font-medium leading-none">{subscription.feeds?.title}</div>
          {isLoose && (
            <div className="mt-1 line-clamp-1 text-xs text-zinc-500">
              {subscription.feeds?.description}
            </div>
          )}
        </div>
        <div className="absolute right-0 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()

              const defaultView = subscription.view

              present({
                title: `${isFollowed ? `${t.common("words.edit")} ` : ""}${APP_NAME} - ${subscription.feeds.title}`,
                clickOutsideToDismiss: true,
                content: ({ dismiss }) => (
                  <FeedForm
                    asWidget
                    id={subscription.feedId}
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
              t("user_profile.edit")
            ) : (
              <>
                <FollowIcon className="mr-1 size-3" />
                {APP_NAME}
              </>
            )}
          </Button>
        </div>
      </a>
    </m.div>
  )
}
