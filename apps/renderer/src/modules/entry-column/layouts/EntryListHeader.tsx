import { ActionButton } from "@follow/components/ui/button/index.js"
import { DividerVertical } from "@follow/components/ui/divider/index.js"
import { RotatingRefreshIcon } from "@follow/components/ui/loading/index.jsx"
import { EllipsisHorizontalTextWithTooltip } from "@follow/components/ui/typography/index.js"
import { FeedViewType, views } from "@follow/constants"
import { useIsOnline } from "@follow/hooks"
import { IN_ELECTRON } from "@follow/shared/constants"
import { stopPropagation } from "@follow/utils/dom"
import { cn, getOS, isBizId } from "@follow/utils/utils"
import type { FC } from "react"
import * as React from "react"
import { useTranslation } from "react-i18next"

import { setGeneralSetting, useGeneralSettingKey } from "~/atoms/settings/general"
import { setUISetting, useUISettingKey } from "~/atoms/settings/ui"
import { useWhoami } from "~/atoms/user"
import { ImpressionView } from "~/components/common/ImpressionTracker"
import { FEED_COLLECTION_LIST, ROUTE_ENTRY_PENDING } from "~/constants"
import { shortcuts } from "~/constants/shortcuts"
import { useRouteParams } from "~/hooks/biz/useRouteParams"
import { useAIDailyReportModal } from "~/modules/ai/ai-daily/useAIDailyReportModal"
import { EntryHeader } from "~/modules/entry-content/header"
import { useRefreshFeedMutation } from "~/queries/feed"
import { useFeedById, useFeedHeaderTitle } from "~/store/feed"

import { MarkAllReadWithOverlay } from "../components/mark-all-button"

export const EntryListHeader: FC<{
  totalCount: number
  refetch: () => void
  isRefreshing: boolean
  hasUpdate: boolean
}> = ({ totalCount, refetch, isRefreshing, hasUpdate }) => {
  const routerParams = useRouteParams()
  const { t } = useTranslation()

  const unreadOnly = useGeneralSettingKey("unreadOnly")

  const { feedId, entryId, view, listId } = routerParams

  const headerTitle = useFeedHeaderTitle()
  const os = getOS()

  const titleAtBottom = IN_ELECTRON && os === "macOS"
  const isInCollectionList = feedId === FEED_COLLECTION_LIST

  const titleInfo = !!headerTitle && (
    <div className={!titleAtBottom ? "min-w-0 translate-y-1" : void 0}>
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
  const titleStyleBasedView = ["pl-6", "pl-7", "pl-7", "pl-7", "px-5", "pl-6"]

  return (
    <div
      ref={containerRef}
      className={cn(
        "mb-2 flex w-full flex-col pr-4 pt-2.5 transition-[padding] duration-300 ease-in-out",
        titleStyleBasedView[view],
      )}
    >
      <div className={cn("flex w-full", titleAtBottom ? "justify-end" : "justify-between")}>
        {!titleAtBottom && titleInfo}

        <div
          className={cn(
            "relative z-[1] flex items-center gap-1 self-baseline text-zinc-500",
            (isInCollectionList || !headerTitle) && "pointer-events-none opacity-0",

            "translate-x-[6px]",
          )}
          onClick={stopPropagation}
        >
          {views[view].wideMode && entryId && entryId !== ROUTE_ENTRY_PENDING && (
            <>
              <EntryHeader view={view} entryId={entryId} />
              <DividerVertical className="mx-2 w-px" />
            </>
          )}

          <AppendTaildingDivider>
            {!views[view].wideMode && <WideModeButton />}
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
      {titleAtBottom && titleInfo}
      {/* <TimelineTabs /> */}
    </div>
  )
}

const DailyReportButton: FC = () => {
  const present = useAIDailyReportModal()
  const { t } = useTranslation()

  return (
    <ImpressionView event="Daily Report Modal">
      <ActionButton
        onClick={() => {
          present()
          window.analytics?.capture("Daily Report Modal", {
            click: 1,
          })
        }}
        tooltip={t("entry_list_header.daily_report")}
      >
        <i className="i-mgc-magic-2-cute-re" />
      </ActionButton>
    </ImpressionView>
  )
}

const FilterNoImageButton = () => {
  const enabled = useUISettingKey("pictureViewFilterNoImage")
  const { t } = useTranslation()

  return (
    <ActionButton
      active={enabled}
      onClick={() => {
        setUISetting("pictureViewFilterNoImage", !enabled)
      }}
      tooltip={t(
        enabled ? "entry_list_header.show_all_items" : "entry_list_header.hide_no_image_items",
      )}
    >
      <i className={!enabled ? "i-mgc-photo-album-cute-re" : "i-mgc-photo-album-cute-fi"} />
    </ActionButton>
  )
}

const SwitchToMasonryButton = () => {
  const isMasonry = useUISettingKey("pictureViewMasonry")
  const { t } = useTranslation()

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
          window.analytics?.capture("Switch to Masonry", {
            masonry: !isMasonry ? 1 : 0,
            click: 1,
          })
        }}
        tooltip={
          !isMasonry
            ? t("entry_list_header.switch_to_masonry")
            : t("entry_list_header.switch_to_grid")
        }
      >
        <i className={cn(!isMasonry ? "i-mgc-grid-cute-re" : "i-mgc-grid-2-cute-re")} />
      </ActionButton>
    </ImpressionView>
  )
}

const WideModeButton = () => {
  const isWideMode = useUISettingKey("wideMode")
  const { t } = useTranslation()

  return (
    <ImpressionView
      event="Switch to Wide Mode"
      properties={{
        wideMode: isWideMode ? 1 : 0,
      }}
    >
      <ActionButton
        shortcut={shortcuts.layout.toggleWideMode.key}
        onClick={() => {
          setUISetting("wideMode", !isWideMode)
          // TODO: Remove this after useMeasure can get bounds in time
          window.dispatchEvent(new Event("resize"))
          window.analytics?.capture("Switch to Wide Mode", {
            wideMode: !isWideMode ? 1 : 0,
            click: 1,
          })
        }}
        tooltip={
          !isWideMode
            ? t("entry_list_header.switch_to_widemode")
            : t("entry_list_header.switch_to_normalmode")
        }
      >
        <i
          className={cn(isWideMode ? "i-mgc-align-justify-cute-re" : "i-mgc-align-left-cute-re")}
        />
      </ActionButton>
    </ImpressionView>
  )
}

const AppendTaildingDivider = ({ children }: { children: React.ReactNode }) => (
  <>
    {children}
    {React.Children.toArray(children).filter(Boolean).length > 0 && (
      <DividerVertical className="mx-2 w-px" />
    )}
  </>
)
