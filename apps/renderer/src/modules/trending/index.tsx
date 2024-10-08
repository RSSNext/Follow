import { Button } from "@headlessui/react"
import { useQuery } from "@tanstack/react-query"
import { m } from "framer-motion"
import type { FC } from "react"

import { getTrendingAggregates } from "~/api/trending"
import { FeedIcon } from "~/components/feed-icon"
import { IconoirBrightCrown } from "~/components/icons/crown"
import { PhUsersBold } from "~/components/icons/users"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { LoadingCircle } from "~/components/ui/loading"
import { useModalStack } from "~/components/ui/modal"
import { DrawerModalLayout } from "~/components/ui/modal/stacked/custom-modal"
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip"
import { EllipsisHorizontalTextWithTooltip } from "~/components/ui/typography"
import { useFollow } from "~/hooks/biz/useFollow"
import { stopPropagation } from "~/lib/dom"
import { cn } from "~/lib/utils"
import type { Models } from "~/models"

import { usePresentUserProfileModal } from "../profile/hooks"

export const Trend = () => {
  const { present } = useModalStack()
  return (
    <Tooltip>
      <TooltipContent>Trending</TooltipContent>
      <TooltipTrigger asChild>
        <m.button
          type="button"
          onClick={() => {
            present({
              title: "Trending",
              content: TrendContent,
              CustomModalComponent: DrawerModalLayout,
            })
          }}
          className={cn(
            "box-content flex size-6 items-center justify-center rounded-full p-1 text-accent",
            "duration-200 hover:shadow-none",
            "cursor-pointer",
            "absolute bottom-0 right-2",
          )}
          initial={{
            scale: 0,
          }}
          animate={{
            scale: 1,
          }}
          whileTap={{
            scale: 0.92,
          }}
        >
          <i className="i-mingcute-trending-up-line" />
        </m.button>
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

  if (!data)
    return (
      <div className="center absolute inset-0">
        <LoadingCircle size="large" />
      </div>
    )
  return (
    <div className="flex size-full grow flex-col gap-4">
      <div className="flex w-full items-center justify-center gap-2 text-2xl">
        <i className="i-mingcute-trending-up-line text-3xl" />
        <span className="font-bold">Trending</span>
      </div>
      <div className="flex h-0 w-[calc(100%+8px)] grow flex-col overflow-auto pb-4 pr-2">
        <TrendingUsers data={data.trendingUsers} />
        <TrendingLists data={data.trendingLists} />
        <TrendingFeeds data={data.trendingFeeds} />

        <TrendingEntries data={data.trendingEntries} />
      </div>
    </div>
  )
}
const TrendingLists: FC<{
  data: Models.TrendingList[]
}> = ({ data }) => {
  const follow = useFollow()
  return (
    <section className="mt-8 w-full text-left">
      <h2 className="my-2 text-xl font-bold">Trending Lists</h2>

      <ul className="mt-4 flex flex-col gap-3 pb-4">
        {data.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              className={cn(
                "flex w-full min-w-0 cursor-pointer items-center pl-2",
                "rounded-md duration-200 hover:bg-gray-100 dark:hover:bg-zinc-800",
                !!item.description && "rounded-xl py-2",
              )}
              onClick={() => {
                follow({ isList: true, id: item.id })
              }}
            >
              <FeedIcon feed={item} size={60} className="rounded" />

              <div className={cn("ml-1 flex w-full flex-col text-left")}>
                <div className="flex items-end gap-2">
                  <div className={cn("truncate text-base font-medium")}>{item.title}</div>

                  <UserCount count={item.subscriberCount} />
                </div>
                <div className={cn("-mt-1 line-clamp-2 text-sm")}>{item.description}</div>
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
  user: Models.User
  position: string
}

const TopUserAvatar: React.FC<TopUserAvatarProps> = ({ user, position }) => (
  <div className={`absolute ${position} flex w-[50px] flex-col`}>
    <Avatar className="block aspect-square size-7 overflow-hidden rounded-full border border-border ring-1 ring-background">
      <AvatarImage src={user?.image || undefined} />
      <AvatarFallback>{user.name?.slice(0, 2)}</AvatarFallback>
    </Avatar>

    {user.name && (
      <EllipsisHorizontalTextWithTooltip className="pr-8 text-xs font-medium">
        <span>{user.name}</span>
      </EllipsisHorizontalTextWithTooltip>
    )}
  </div>
)

const TrendingUsers: FC<{ data: Models.User[] }> = ({ data }) => {
  const profile = usePresentUserProfileModal("dialog")
  return (
    <section className="w-full text-left">
      <h2 className="my-2 text-xl font-bold">Trending Users</h2>
      <div className="relative h-[100px]">
        <div className="absolute left-[calc(50%+15px)] top-[8px] rotate-[40deg] text-[20px] text-accent">
          <IconoirBrightCrown />
        </div>
        {/* Top 3 users */}
        {data.slice(0, 3).map((user, index: number) => (
          <button
            onFocusCapture={stopPropagation}
            className="cursor-pointer"
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
            <li key={user.id} className="flex items-center gap-3">
              <button
                onFocusCapture={stopPropagation}
                className="cursor-pointer"
                type="button"
                onClick={() => {
                  profile(user.id)
                }}
              >
                <Avatar className="block aspect-square size-7 overflow-hidden rounded-full border border-border ring-1 ring-background">
                  <AvatarImage src={user?.image || undefined} />
                  <AvatarFallback>{user.name?.slice(0, 2)}</AvatarFallback>
                </Avatar>
              </button>

              <span className="font-medium">{user.name}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

const TrendingFeeds = ({ data }: { data: Models.TrendingFeed[] }) => {
  const follow = useFollow()
  return (
    <section className="mt-8 w-full text-left">
      <h2 className="my-2 text-xl font-bold">Trending Feeds</h2>

      <ul className="mt-2 flex flex-col">
        {data.map((feed) => {
          return (
            <li
              className={cn(
                "group flex w-full items-center gap-1 rounded-md pl-2 duration-200 hover:bg-gray-100 dark:hover:bg-zinc-800",
                "relative",
              )}
              key={feed.id}
            >
              <a
                target="_blank"
                href={`/feed/${feed.id}`}
                className="flex grow items-center gap-2 py-1"
              >
                <div className="size-4">
                  <FeedIcon feed={feed} size={60} className="rounded" />
                </div>
                <div className="flex w-full min-w-0 grow items-center">
                  <div className={cn("truncate")}>{feed.title}</div>
                </div>
              </a>

              <div className="pr-2">
                <UserCount count={feed.subscriberCount} />

                <Button
                  type="button"
                  className={cn(
                    "absolute inset-y-0 right-0 font-medium opacity-0 duration-200 group-hover:opacity-100",
                  )}
                  onClick={() => {
                    follow({ isList: false, id: feed.id })
                  }}
                >
                  Follow
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
