import type { User } from "@auth/core/types"
import { useQuery } from "@tanstack/react-query"
import type { FC } from "react"
import { useTranslation } from "react-i18next"

import { getTrendingAggregates } from "~/api/trending"
import { FeedIcon } from "~/components/feed-icon"
import { PhUsersBold } from "~/components/icons/users"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { ActionButton, Button } from "~/components/ui/button"
import { LoadingWithIcon } from "~/components/ui/loading"
import { useCurrentModal, useModalStack } from "~/components/ui/modal"
import { DrawerModalLayout } from "~/components/ui/modal/stacked/custom-modal"
import { ScrollArea } from "~/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip"
import { EllipsisHorizontalTextWithTooltip } from "~/components/ui/typography"
import { useFollow } from "~/hooks/biz/useFollow"
import { stopPropagation } from "~/lib/dom"
import { UrlBuilder } from "~/lib/url-builder"
import { cn } from "~/lib/utils"
import type { FeedModel, Models } from "~/models"

import { usePresentUserProfileModal } from "../profile/hooks"

export const Trend = ({ className }: { className?: string }) => {
  const { present } = useModalStack()
  const { t } = useTranslation()
  return (
    <Tooltip>
      <TooltipContent>{t("words.trending")}</TooltipContent>
      <TooltipTrigger asChild>
        <ActionButton
          onClick={() => {
            present({
              title: "Trending",
              content: TrendContent,
              CustomModalComponent: DrawerModalLayout,
            })
          }}
          className={cn(
            "size-6 text-accent duration-200 hover:shadow-none",
            "absolute bottom-1 right-3",
            className,
          )}
        >
          <i className="i-mgc-trending-up-cute-re" />
        </ActionButton>
      </TooltipTrigger>
    </Tooltip>
  )
}
const TrendContent = () => {
  const { data } = useQuery({
    queryKey: ["trending"],
    queryFn: () => {
      return getTrendingAggregates()
    },
  })

  const { t } = useTranslation()
  const { dismiss } = useCurrentModal()
  if (!data)
    return (
      <div className="center absolute inset-0">
        <LoadingWithIcon
          icon={<i className="i-mingcute-trending-up-line text-3xl" />}
          size="large"
        />
      </div>
    )
  return (
    <div className="flex size-full grow flex-col gap-4">
      <div className="-mt-4 flex w-full items-center justify-center gap-2 text-2xl">
        <i className="i-mingcute-trending-up-line text-3xl" />
        <span className="font-bold">{t("words.trending")}</span>
      </div>
      <ActionButton
        className="absolute right-4 top-4"
        onClick={dismiss}
        tooltip={t("close", { ns: "common" })}
      >
        <i className="i-mgc-close-cute-re" />
      </ActionButton>
      <ScrollArea.ScrollArea
        rootClassName="flex h-0 w-[calc(100%+8px)] grow flex-col overflow-visible"
        viewportClassName="pb-4"
        scrollbarClassName="-mr-6"
      >
        <TrendingUsers data={data.trendingUsers} />
        <TrendingLists data={data.trendingLists} />
        <TrendingFeeds data={data.trendingFeeds} />

        <TrendingEntries data={data.trendingEntries} />
      </ScrollArea.ScrollArea>
    </div>
  )
}
const TrendingLists: FC<{
  data: Models.TrendingList[]
}> = ({ data }) => {
  const follow = useFollow()
  const { t } = useTranslation()
  return (
    <section className="mt-8 w-full text-left">
      <h2 className="my-2 text-xl font-bold">{t("trending.list")}</h2>

      <ul className="mt-4 flex flex-col gap-3 pb-4">
        {data.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              className={"group relative flex w-full min-w-0 items-center pl-2"}
              onClick={() => {
                follow({ isList: true, id: item.id })
              }}
            >
              <div className="absolute -inset-y-1 inset-x-0 rounded-lg duration-200 group-hover:bg-theme-item-hover" />
              <FeedIcon feed={item as any} size={40} />

              <div className={cn("ml-1 flex w-full flex-col text-left")}>
                <div className="flex items-end gap-2">
                  <div className={cn("truncate text-base font-medium")}>{item.title}</div>

                  <UserCount count={item.subscriberCount} />
                </div>
                {!!item.description && (
                  <div className={"-mt-0.5 line-clamp-2 text-xs"}>{item.description}</div>
                )}
              </div>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

const UserCount = ({ count }: { count: number }) => {
  return (
    <span className="flex -translate-y-0.5 items-center gap-0.5 text-xs tabular-nums text-gray-500">
      <PhUsersBold className="size-3" />
      {count}
    </span>
  )
}

interface TopUserAvatarProps {
  user: User
  position: string
}

const TopUserAvatar: React.FC<TopUserAvatarProps> = ({ user, position }) => (
  <div className={`absolute ${position} group flex w-[50px] flex-col`}>
    <div className="absolute -inset-x-4 -inset-y-2 rounded-lg duration-200 group-hover:bg-theme-item-hover" />
    <Avatar className="block aspect-square size-[50px] overflow-hidden rounded-full border border-border ring-1 ring-background">
      <AvatarImage src={user?.image || undefined} />
      <AvatarFallback>{user.name?.slice(0, 2)}</AvatarFallback>
    </Avatar>

    {user.name && (
      <EllipsisHorizontalTextWithTooltip className="mt-2 text-xs font-medium">
        <span>{user.name}</span>
      </EllipsisHorizontalTextWithTooltip>
    )}
  </div>
)

const TrendingUsers: FC<{ data: User[] }> = ({ data }) => {
  const profile = usePresentUserProfileModal("dialog")
  const { t } = useTranslation()
  return (
    <section className="w-full text-left">
      <h2 className="my-2 text-xl font-bold">{t("trending.user")}</h2>
      <div className="relative h-[100px]">
        <div className="absolute left-[calc(50%+15px)] top-[8px] rotate-45 text-[20px] text-accent">
          <i className="i-mgc-vip-2-cute-fi" />
        </div>

        <div className="absolute left-[calc(33%+15px)] top-[calc(theme(spacing.3))] rotate-45 text-[20px] text-accent/80">
          <i className="i-mgc-vip-2-cute-re" />
        </div>

        {data.slice(0, 3).map((user, index: number) => (
          <button
            onFocusCapture={stopPropagation}
            type="button"
            onClick={() => {
              profile(user.id)
            }}
            key={user.id}
          >
            <TopUserAvatar
              user={user}
              position={
                index === 0
                  ? "left-1/2 -translate-x-1/2"
                  : index === 1
                    ? "left-1/3 top-6 -translate-x-1/2"
                    : "left-2/3 top-6 -translate-x-1/2"
              }
            />
          </button>
        ))}
      </div>

      {data.length > 3 && (
        <ul className="mt-8 flex flex-col gap-4 pl-2">
          {data.slice(3).map((user) => (
            <li key={user.id}>
              <button
                onFocusCapture={stopPropagation}
                className="group relative flex w-full items-center gap-3"
                type="button"
                onClick={() => {
                  profile(user.id)
                }}
              >
                <div className="absolute -inset-2 right-0 rounded-lg duration-200 group-hover:bg-theme-item-hover" />
                <Avatar className="block aspect-square size-[40px] overflow-hidden rounded-full border border-border ring-1 ring-background">
                  <AvatarImage src={user?.image || undefined} />
                  <AvatarFallback>{user.name?.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{user.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

const TrendingFeeds = ({ data }: { data: FeedModel[] }) => {
  const follow = useFollow()
  const { t } = useTranslation()
  return (
    <section className="mt-8 w-full text-left">
      <h2 className="my-2 text-xl font-bold">{t("trending.feed")}</h2>

      <ul className="mt-2 flex flex-col">
        {data.map((feed) => {
          return (
            <li
              className={cn(
                "group flex w-full items-center gap-1 rounded-md pl-2 duration-200 hover:bg-theme-item-hover",
                "relative",
              )}
              key={feed.id}
            >
              <a
                target="_blank"
                href={UrlBuilder.shareFeed(feed.id)}
                className="flex grow items-center gap-2 py-1"
              >
                <div>
                  <FeedIcon feed={feed} size={24} className="rounded" />
                </div>
                <div className="flex w-full min-w-0 grow items-center">
                  <div className={"truncate"}>{feed.title}</div>
                </div>
              </a>

              <div className="pr-2">
                <UserCount count={(feed as any).subscriberCount} />

                <Button
                  type="button"
                  buttonClassName={
                    "absolute inset-y-0.5 right-0 font-medium opacity-0 duration-200 group-hover:opacity-100"
                  }
                  onClick={() => {
                    follow({ isList: false, id: feed.id })
                  }}
                >
                  {t("feed_form.follow")}
                </Button>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

const TrendingEntries = ({ data }: { data: Models.TrendingEntry[] }) => {
  const filteredData = data.filter((entry) => !entry.url.startsWith("https://x.com"))
  return (
    <section className="mt-8 w-full text-left">
      <h2 className="my-2 text-xl font-bold">Trending Entries</h2>

      <ul className="mt-2 list-inside list-disc space-y-1">
        {filteredData.map((entry) => {
          return (
            <li
              key={entry.id}
              className="relative truncate whitespace-nowrap pr-10 marker:text-accent"
            >
              <a
                href={entry.url}
                target="_blank"
                rel="noopener noreferrer"
                className="follow-link--underline truncate text-sm"
              >
                {entry.title}
              </a>
              <span className="absolute right-0 top-0 flex items-center gap-0.5 text-xs opacity-60">
                <i className="i-mingcute-book-2-line" />
                <span>{entry.readCount}</span>
              </span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
