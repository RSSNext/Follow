import { FollowIcon } from "@follow/components/icons/follow.js"
import { ActionButton } from "@follow/components/ui/button/index.js"
import { RotatingRefreshIcon } from "@follow/components/ui/loading/index.jsx"
import { PresentSheet } from "@follow/components/ui/sheet/Sheet.js"
import { EllipsisHorizontalTextWithTooltip } from "@follow/components/ui/typography/index.js"
import { FeedViewType } from "@follow/constants"
import { useIsOnline } from "@follow/hooks"
import { stopPropagation } from "@follow/utils/dom"
import { cn, isBizId } from "@follow/utils/utils"
import type { FC } from "react"
import * as React from "react"
import { useTranslation } from "react-i18next"

import { setGeneralSetting, useGeneralSettingKey } from "~/atoms/settings/general"
import { useWhoami } from "~/atoms/user"
import { HeaderTopReturnBackButton } from "~/components/mobile/button"
import { FEED_COLLECTION_LIST, ROUTE_FEED_IN_LIST } from "~/constants"
import { shortcuts } from "~/constants/shortcuts"
import { useRouteParams } from "~/hooks/biz/useRouteParams"
import { MainMobileLayout } from "~/modules/app-layout/left-sidebar/mobile"
import { useRefreshFeedMutation } from "~/queries/feed"
import { useFeedById, useFeedHeaderTitle } from "~/store/feed"

import { MarkAllReadWithOverlay } from "../components/mark-all-button"
import type { EntryListHeaderProps } from "./EntryListHeader.shared"
import {
  AppendTaildingDivider,
  DailyReportButton,
  FilterNoImageButton,
  SwitchToMasonryButton,
} from "./EntryListHeader.shared"
import { TimelineTabs } from "./TimelineTabs"

export const EntryListHeader: FC<EntryListHeaderProps> = ({
  totalCount,
  refetch,
  isRefreshing,
  hasUpdate,
}) => {
  const routerParams = useRouteParams()
  const { t } = useTranslation()

  const unreadOnly = useGeneralSettingKey("unreadOnly")

  const { feedId, view, listId } = routerParams

  const headerTitle = useFeedHeaderTitle()

  const isTimelineFirst = useGeneralSettingKey("startupScreen") === "timeline"

  const isInCollectionList =
    feedId === FEED_COLLECTION_LIST || feedId?.startsWith(ROUTE_FEED_IN_LIST)

  const titleInfo = !!headerTitle && (
    <div className="min-w-0">
      <div className="h-6 min-w-0 break-all text-lg font-bold leading-tight">
        <EllipsisHorizontalTextWithTooltip className="inline-block !w-auto max-w-full">
          <span className="relative -top-px">{headerTitle}</span>
        </EllipsisHorizontalTextWithTooltip>
      </div>
      <div className="whitespace-nowrap text-xs font-medium leading-none text-zinc-400">
        {totalCount || 0} {t("quantifier.piece", { ns: "common" })}
        {unreadOnly && !isInCollectionList ? t("words.unread") : ""}
        {t("space", { ns: "common" })}
        {t("words.items", { ns: "common", count: totalCount })}
      </div>
    </div>
  )
  const { mutateAsync: refreshFeed, isPending } = useRefreshFeedMutation(feedId)

  const user = useWhoami()
  const isOnline = useIsOnline()

  const feed = useFeedById(feedId)
  const isList = !!listId

  const containerRef = React.useRef<HTMLDivElement>(null)

  return (
    <div
      ref={containerRef}
      className={cn(
        "mb-2 flex w-full flex-col pr-4 transition-[padding] duration-300 ease-in-out",
        "pl-6 pt-safe-offset-2.5",
        "bg-background",
      )}
    >
      <div className="flex w-full justify-between pb-1 pl-8">
        {isTimelineFirst ? (
          <FollowSubscriptionButton />
        ) : (
          <HeaderTopReturnBackButton
            to={`/?view=${view}`}
            className="absolute left-3 translate-y-px text-zinc-500"
          />
        )}
        {titleInfo}
        <div
          className={cn(
            "relative z-[1] flex items-center gap-1 self-baseline text-zinc-500",
            (isInCollectionList || !headerTitle) && "pointer-events-none opacity-0",

            "translate-x-[6px]",
          )}
          onClick={stopPropagation}
        >
          <AppendTaildingDivider>
            {view === FeedViewType.SocialMedia && <DailyReportButton />}
            {view === FeedViewType.Pictures && <SwitchToMasonryButton />}
            {view === FeedViewType.Pictures && <FilterNoImageButton />}
          </AppendTaildingDivider>

          {isOnline &&
            (feed?.ownerUserId === user?.id &&
            isBizId(routerParams.feedId!) &&
            feed?.type === "feed" ? (
              <ActionButton
                tooltip="Refresh"
                onClick={() => {
                  refreshFeed()
                }}
              >
                <RotatingRefreshIcon isRefreshing={isPending} />
              </ActionButton>
            ) : (
              <ActionButton
                tooltip={
                  hasUpdate
                    ? t("entry_list_header.new_entries_available")
                    : t("entry_list_header.refetch")
                }
                onClick={() => {
                  refetch()
                }}
              >
                <RotatingRefreshIcon
                  className={cn(hasUpdate && "text-accent")}
                  isRefreshing={isRefreshing}
                />
              </ActionButton>
            ))}
          {!isList && (
            <>
              <ActionButton
                tooltip={
                  !unreadOnly
                    ? t("entry_list_header.show_unread_only")
                    : t("entry_list_header.show_all")
                }
                shortcut={shortcuts.entries.toggleUnreadOnly.key}
                onClick={() => setGeneralSetting("unreadOnly", !unreadOnly)}
              >
                {unreadOnly ? (
                  <i className="i-mgc-round-cute-fi" />
                ) : (
                  <i className="i-mgc-round-cute-re" />
                )}
              </ActionButton>
              <MarkAllReadWithOverlay containerRef={containerRef} shortcut />
            </>
          )}
        </div>
      </div>

      <TimelineTabs />
    </div>
  )
}

const FollowSubscriptionButton = () => {
  return (
    <PresentSheet
      zIndex={90}
      dismissableClassName="mb-0"
      triggerAsChild
      content={<MainMobileLayout />}
      modalClassName="bg-background pt-4"
      contentClassName="p-0"
    >
      <ActionButton tooltip="Subscription" className="absolute left-3 translate-y-px text-zinc-500">
        <FollowIcon className="size-4" />
      </ActionButton>
    </PresentSheet>
  )
}
