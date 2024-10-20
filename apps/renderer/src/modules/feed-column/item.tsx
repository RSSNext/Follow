import dayjs from "dayjs"
import { memo, useCallback, useState } from "react"
import { useTranslation } from "react-i18next"

import { getMainContainerElement } from "~/atoms/dom"
import { FeedCertification } from "~/components/feed-certification"
import { FeedIcon } from "~/components/feed-icon"
import { OouiUserAnonymous } from "~/components/icons/OouiUserAnonymous"
import { Tooltip, TooltipContent, TooltipPortal, TooltipTrigger } from "~/components/ui/tooltip"
import { EllipsisHorizontalTextWithTooltip } from "~/components/ui/typography"
import { useFeedActions, useInboxActions, useListActions } from "~/hooks/biz/useFeedActions"
import { useNavigateEntry } from "~/hooks/biz/useNavigateEntry"
import { useRouteParamsSelector } from "~/hooks/biz/useRouteParams"
import { useAnyPointDown } from "~/hooks/common"
import { nextFrame } from "~/lib/dom"
import type { FeedViewType } from "~/lib/enum"
import { getNewIssueUrl } from "~/lib/issues"
import { showNativeMenu } from "~/lib/native-menu"
import { UrlBuilder } from "~/lib/url-builder"
import { cn } from "~/lib/utils"
import { getPreferredTitle, useFeedById } from "~/store/feed"
import { useInboxById } from "~/store/inbox"
import { useListById } from "~/store/list"
import { subscriptionActions, useSubscriptionByFeedId } from "~/store/subscription"
import { useFeedUnreadStore } from "~/store/unread"

import { feedColumnStyles } from "./styles"
import { UnreadNumber } from "./unread-number"

interface FeedItemProps {
  feedId: string
  view?: number
  className?: string
}
const FeedItemImpl = ({ view, feedId, className }: FeedItemProps) => {
  const { t } = useTranslation()
  const subscription = useSubscriptionByFeedId(feedId)
  const navigate = useNavigateEntry()
  const feed = useFeedById(feedId)

  const handleNavigate: React.MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      e.stopPropagation()
      if (view === undefined) return
      navigate({
        feedId,
        entryId: null,
        view,
      })
      // focus to main container in order to let keyboard can navigate entry items by arrow keys
      nextFrame(() => {
        getMainContainerElement()?.focus()
      })
    },
    [feedId, navigate, view, feed?.type],
  )

  const feedUnread = useFeedUnreadStore((state) => state.data[feedId] || 0)

  const isActive = useRouteParamsSelector((routerParams) => routerParams.feedId === feedId)

  const { items } = useFeedActions({ feedId, view })

  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false)
  useAnyPointDown(() => {
    setIsContextMenuOpen(false)
  })
  if (!feed) return null

  const isFeed = feed.type === "feed" || !feed.type

  return (
    <>
      <div
        data-feed-id={feedId}
        data-active={isActive || isContextMenuOpen}
        className={cn(
          "flex w-full cursor-menu items-center justify-between rounded-md py-[2px] pr-2.5 text-sm font-medium leading-loose",
          feedColumnStyles.item,
          isFeed ? "py-[2px]" : "py-1.5",
          className,
        )}
        onClick={handleNavigate}
        onDoubleClick={() => {
          window.open(UrlBuilder.shareFeed(feedId, view), "_blank")
        }}
        onContextMenu={(e) => {
          setIsContextMenuOpen(true)
          const nextItems = items.concat()
          if (isFeed && feed.errorAt && feed.errorMessage) {
            nextItems.push(
              {
                type: "separator",
                disabled: false,
              },
              {
                label: "Feedback",
                type: "text",
                click: () => {
                  window.open(
                    getNewIssueUrl({
                      body:
                        `### Error\n\nError Message: ${feed.errorMessage}\n\n### Info\n\n` +
                        `\`\`\`json\n${JSON.stringify(feed, null, 2)}\n\`\`\``,
                      label: "bug",
                      title: `Feed Error: ${feed.title}, ${feed.errorMessage}`,
                    }),
                  )
                },
              },
            )
          }
          showNativeMenu(nextItems, e)
        }}
      >
        <div
          className={cn(
            "flex min-w-0 items-center",
            isFeed && feed.errorAt && "text-red-900 dark:text-red-500",
          )}
        >
          <FeedIcon fallback feed={feed} size={16} />
          <div className="truncate">{getPreferredTitle(feed)}</div>
          {isFeed && <FeedCertification feed={feed} className="text-[15px]" />}
          {isFeed && feed.errorAt && (
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <i className="i-mgc-wifi-off-cute-re ml-1 shrink-0 text-base" />
              </TooltipTrigger>
              <TooltipPortal>
                <TooltipContent>
                  <div className="flex items-center gap-1">
                    <i className="i-mgc-time-cute-re" />
                    {t("feed_item.error_since")}{" "}
                    {dayjs
                      .duration(dayjs(feed.errorAt).diff(dayjs(), "minute"), "minute")
                      .humanize(true)}
                  </div>
                  {!!feed.errorMessage && (
                    <div className="flex items-center gap-1">
                      <i className="i-mgc-bug-cute-re" />
                      {feed.errorMessage}
                    </div>
                  )}
                </TooltipContent>
              </TooltipPortal>
            </Tooltip>
          )}
          {subscription.isPrivate && (
            <Tooltip delayDuration={300}>
              <TooltipTrigger>
                <OouiUserAnonymous className="ml-1 shrink-0 text-base" />
              </TooltipTrigger>
              <TooltipPortal>
                <TooltipContent>{t("feed_item.not_publicly_visible")}</TooltipContent>
              </TooltipPortal>
            </Tooltip>
          )}
        </div>
        <UnreadNumber unread={feedUnread} className="ml-2" />
      </div>
    </>
  )
}

export const FeedItem = memo(FeedItemImpl)

const ListItemImpl: Component<{
  listId: string
  view: FeedViewType
  iconSize?: number
}> = ({ view, listId, className, iconSize = 28 }) => {
  const list = useListById(listId)

  const isActive = useRouteParamsSelector((routerParams) => routerParams.listId === listId)
  const { items } = useListActions({ listId, view })

  const listUnread = useFeedUnreadStore((state) => state.data[listId] || 0)

  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false)
  useAnyPointDown(() => {
    setIsContextMenuOpen(false)
  })
  const subscription = useSubscriptionByFeedId(listId)
  const navigate = useNavigateEntry()
  const handleNavigate = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()

      navigate({
        listId,
        entryId: null,
        view,
      })
      subscriptionActions.markReadByFeedIds({
        listId,
      })
      // focus to main container in order to let keyboard can navigate entry items by arrow keys
      nextFrame(() => {
        getMainContainerElement()?.focus()
      })
    },
    [listId, navigate, view],
  )
  const { t } = useTranslation()
  if (!list) return null
  return (
    <div
      data-list-id={listId}
      data-active={isActive || isContextMenuOpen}
      className={cn(
        "flex w-full cursor-menu items-center justify-between rounded-md pr-2.5 text-sm font-medium leading-loose",
        feedColumnStyles.item,
        "py-1.5 pl-2.5",
        className,
      )}
      onClick={handleNavigate}
      onDoubleClick={() => {
        window.open(UrlBuilder.shareList(listId, view), "_blank")
      }}
      onContextMenu={(e) => {
        setIsContextMenuOpen(true)

        showNativeMenu(items, e)
      }}
    >
      <div className={"flex min-w-0 items-center"}>
        <FeedIcon fallback feed={list} size={iconSize} />
        <EllipsisHorizontalTextWithTooltip className="truncate">
          {getPreferredTitle(list)}
        </EllipsisHorizontalTextWithTooltip>

        {subscription.isPrivate && (
          <Tooltip delayDuration={300}>
            <TooltipTrigger>
              <OouiUserAnonymous className="ml-1 shrink-0 text-base" />
            </TooltipTrigger>
            <TooltipPortal>
              <TooltipContent>{t("feed_item.not_publicly_visible")}</TooltipContent>
            </TooltipPortal>
          </Tooltip>
        )}
      </div>
      <UnreadNumber unread={listUnread} isList className="ml-2" />
    </div>
  )
}

export const ListItem = memo(ListItemImpl)

const InboxItemImpl: Component<{
  inboxId: string
  view: FeedViewType
  iconSize?: number
}> = ({ view, inboxId, className, iconSize = 16 }) => {
  const inbox = useInboxById(inboxId)

  const isActive = useRouteParamsSelector((routerParams) => routerParams.inboxId === inboxId)
  const { items } = useInboxActions({ inboxId })

  const inboxUnread = useFeedUnreadStore((state) => state.data[inboxId] || 0)

  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false)
  useAnyPointDown(() => {
    setIsContextMenuOpen(false)
  })
  const navigate = useNavigateEntry()
  const handleNavigate = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()

      navigate({
        inboxId,
        entryId: null,
        view,
      })
    },
    [inboxId, navigate, view],
  )
  if (!inbox) return null
  return (
    <div
      data-active={isActive || isContextMenuOpen}
      data-inbox-id={inboxId}
      className={cn(
        "flex w-full cursor-menu items-center justify-between rounded-md pr-2.5 text-sm font-medium leading-loose",
        feedColumnStyles.item,
        "py-[2px] pl-2.5",
        className,
      )}
      onClick={handleNavigate}
      onContextMenu={(e) => {
        setIsContextMenuOpen(true)
        showNativeMenu(items, e)
      }}
    >
      <div className={"flex min-w-0 items-center"}>
        <FeedIcon fallback feed={inbox} size={iconSize} />
        <EllipsisHorizontalTextWithTooltip className="truncate">
          {getPreferredTitle(inbox)}
        </EllipsisHorizontalTextWithTooltip>
      </div>
      <UnreadNumber unread={inboxUnread} className="ml-2" />
    </div>
  )
}

export const InboxItem = memo(InboxItemImpl)
