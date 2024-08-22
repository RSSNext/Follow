import {
  setGeneralSetting,
  useGeneralSettingKey,
} from "@renderer/atoms/settings/general"
import { setUISetting, useUISettingKey } from "@renderer/atoms/settings/ui"
import { useWhoami } from "@renderer/atoms/user"
import { ImpressionView } from "@renderer/components/common/ImpressionTracker"
import { ActionButton } from "@renderer/components/ui/button"
import { DividerVertical } from "@renderer/components/ui/divider"
import { EllipsisHorizontalTextWithTooltip } from "@renderer/components/ui/typography"
import {
  FEED_COLLECTION_LIST,
  ROUTE_ENTRY_PENDING,
  views,
} from "@renderer/constants"
import { shortcuts } from "@renderer/constants/shortcuts"
import { useRouteParms } from "@renderer/hooks/biz/useRouteParams"
import { useIsOnline } from "@renderer/hooks/common"
import { FeedViewType } from "@renderer/lib/enum"
import { cn, getOS, isBizId } from "@renderer/lib/utils"
import { useAIDailyReportModal } from "@renderer/modules/ai/ai-daily/hooks"
import { EntryHeader } from "@renderer/modules/entry-content/header"
import { useRefreshFeedMutation } from "@renderer/queries/feed"
import { useFeedById, useFeedHeaderTitle } from "@renderer/store/feed"
import type { FC } from "react"
import * as React from "react"

import { MarkAllReadButton } from "../components/mark-all-button"

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
              <DividerVertical className="mx-2 w-px" />
            </>
          )}

          <AppendTaildingDivider>
            {view === FeedViewType.SocialMedia && <DailyReportButton />}
            {view === FeedViewType.Pictures && <SwitchToMasonryButton />}
          </AppendTaildingDivider>

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
                        hasUpdate && "text-accent",
                      )}
                    />
                  </ActionButton>
                )
          ) : null}
          <ActionButton
            tooltip={unreadOnly ? "Show unread Only" : "Show all"}
            shortcut={shortcuts.entries.toggleUnreadOnly.key}
            onClick={() => setGeneralSetting("unreadOnly", !unreadOnly)}
          >
            {unreadOnly ? (
              <i className="i-mgc-round-cute-fi" />
            ) : (
              <i className="i-mgc-round-cute-re" />
            )}
          </ActionButton>
          <MarkAllReadButton shortcut />
        </div>
      </div>
      {titleAtBottom && titleInfo}
    </div>
  )
}

const DailyReportButton: FC = () => {
  const present = useAIDailyReportModal()
  return (
    <ImpressionView event="Daily Report Modal">
      <ActionButton
        onClick={() => {
          present()
          window.posthog?.capture("Daily Report Modal", {
            click: 1,
          })
        }}
        tooltip="Daily Report"
      >
        <i className="i-mgc-magic-2-cute-re" />
      </ActionButton>
    </ImpressionView>
  )
}

const SwitchToMasonryButton = () => {
  const isMasonry = useUISettingKey("pictureViewMasonry")
  return (
    <ImpressionView
      event="Switch to Masonry"
      properties={{
        masonry: isMasonry ? 1 : 0,
      }}
    >
      <ActionButton
        onClick={() => {
          setUISetting("pictureViewMasonry", !isMasonry)
          window.posthog?.capture("Switch to Masonry", {
            masonry: !isMasonry ? 1 : 0,
            click: 1,
          })
        }}
        tooltip={`Switch to ${isMasonry ? "Grid" : "Masonry"}`}
      >
        <i
          className={cn(
            !isMasonry ? "i-mgc-grid-cute-re" : "i-mgc-grid-2-cute-re",
          )}
        />
      </ActionButton>
    </ImpressionView>
  )
}

const AppendTaildingDivider = ({ children }: { children: React.ReactNode }) => (
  <>
    {children}
    {React.Children.count(children) > 1 && (<DividerVertical className="mx-2 w-px" />)}
  </>
)
