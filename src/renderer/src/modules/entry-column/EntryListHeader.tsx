import {
  setGeneralSetting,
  useGeneralSettingKey,
} from "@renderer/atoms/settings/general"
import { useWhoami } from "@renderer/atoms/user"
import { ActionButton } from "@renderer/components/ui/button"
import { DividerVertical } from "@renderer/components/ui/divider"
import { useModalStack } from "@renderer/components/ui/modal"
import { EllipsisHorizontalTextWithTooltip } from "@renderer/components/ui/typography"
import {
  FEED_COLLECTION_LIST,
  ROUTE_ENTRY_PENDING,
  views,
} from "@renderer/constants"
import { shortcuts } from "@renderer/constants/shortcuts"
import {
  useRouteParms,
} from "@renderer/hooks/biz/useRouteParams"
import { useIsOnline } from "@renderer/hooks/common"
import { FeedViewType } from "@renderer/lib/enum"
import { cn, getOS, isBizId } from "@renderer/lib/utils"
import { useRefreshFeedMutation } from "@renderer/queries/feed"
import { useFeedById, useFeedHeaderTitle } from "@renderer/store/feed"
import type { FC } from "react"

import { Daily } from "../entry-content/daily"
import { EntryHeader } from "../entry-content/header"
import { MarkAllButton } from "./mark-all-button"

export const EntryListHeader: FC<{
  totalCount: number
  refetch: () => void
  isRefreshing: boolean
  hasUpdate: boolean
}> = ({ totalCount, refetch, isRefreshing, hasUpdate }) => {
  const routerParams = useRouteParms()

  const unreadOnly = useGeneralSettingKey("unreadOnly")

  const { feedId, entryId, view } = routerParams

  const headerTitle = useFeedHeaderTitle()
  const os = getOS()

  const titleAtBottom = window.electron && os === "macOS"
  const isInCollectionList = feedId === FEED_COLLECTION_LIST

  const titleInfo = !!headerTitle && (
    <div className={!titleAtBottom ? "min-w-0 translate-y-1" : void 0}>
      <div className="min-w-0 break-all text-lg font-bold leading-none">
        <EllipsisHorizontalTextWithTooltip className="inline-block !w-auto max-w-full">
          {headerTitle}
        </EllipsisHorizontalTextWithTooltip>
      </div>
      <div className="text-xs font-medium text-zinc-400">
        {totalCount || 0}
        {" "}
        {unreadOnly && !isInCollectionList ? "Unread" : ""}
        {" "}
        Items
      </div>
    </div>
  )
  const { mutateAsync: refreshFeed, isPending } = useRefreshFeedMutation(
    routerParams.feedId,
  )

  const user = useWhoami()
  const isOnline = useIsOnline()

  const feed = useFeedById(routerParams.feedId)

  const titleStyleBasedView = [
    "pl-12",
    "pl-7",
    "pl-7",
    "pl-7",
    "px-5",
    "pl-12",
  ]

  return (
    <div
      className={cn(
        "mb-2 flex w-full flex-col pr-4 pt-2.5",
        titleStyleBasedView[view],
      )}
    >
      <div
        className={cn(
          "flex w-full",
          titleAtBottom ? "justify-end" : "justify-between",
        )}
      >
        {!titleAtBottom && titleInfo}

        <div
          className={cn(
            "relative z-[1] flex items-center gap-1 self-baseline text-zinc-500",
            (isInCollectionList || !headerTitle) &&
            "pointer-events-none opacity-0",

            "translate-x-[6px]",
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {views[view].wideMode &&
            entryId &&
            entryId !== ROUTE_ENTRY_PENDING && (
            <>
              <EntryHeader view={view} entryId={entryId} />
              <DividerVertical className="w-px" />
            </>
          )}

          {view === FeedViewType.SocialMedia && <DailyReportButton />}

          {isOnline ? (
            feed?.ownerUserId === user?.id && isBizId(routerParams.feedId!) ?
                (
                  <ActionButton
                    tooltip="Refresh"
                    onClick={() => {
                      refreshFeed()
                    }}
                  >
                    <i
                      className={cn(
                        "i-mgc-refresh-2-cute-re",
                        isPending && "animate-spin",
                      )}
                    />
                  </ActionButton>
                ) :
                (
                  <ActionButton
                    tooltip={hasUpdate ? "New entries available" : "Refetch"}
                    onClick={() => {
                      refetch()
                    }}
                  >
                    <i
                      className={cn(
                        "i-mgc-refresh-2-cute-re",
                        isRefreshing && "animate-spin",
                        hasUpdate && "text-theme-accent",
                      )}
                    />
                  </ActionButton>
                )
          ) : null}
          <ActionButton
            tooltip={unreadOnly ? "Unread Only" : "All"}
            shortcut={shortcuts.entries.toggleUnreadOnly.key}
            onClick={() => setGeneralSetting("unreadOnly", !unreadOnly)}
          >
            {unreadOnly ? (
              <i className="i-mgc-round-cute-fi" />
            ) : (
              <i className="i-mgc-round-cute-re" />
            )}
          </ActionButton>
          <MarkAllButton />
        </div>
      </div>
      {titleAtBottom && titleInfo}
    </div>
  )
}

const DailyReportButton: FC = () => {
  const { present } = useModalStack()

  return (
    <ActionButton
      onClick={() => {
        present({
          title: "Daily Report",
          content: () => (
            <Daily
              view={FeedViewType.SocialMedia}

            />
          ),
        })
      }}
      tooltip="Daily Report"
    >
      <i className="i-mgc-magic-2-cute-re" />
    </ActionButton>
  )
}
