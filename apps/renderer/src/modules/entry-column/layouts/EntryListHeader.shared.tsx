import { useMobile } from "@follow/components/hooks/useMobile.js"
import { MdiMeditation } from "@follow/components/icons/Meditation.js"
import { AutoResizeHeight } from "@follow/components/ui/auto-resize-height/index.js"
import { ActionButton } from "@follow/components/ui/button/index.js"
import { DividerVertical } from "@follow/components/ui/divider/Divider.js"
import { SegmentGroup, SegmentItem } from "@follow/components/ui/segment/index.js"
import { Slider } from "@follow/components/ui/slider/index.js"
import { clsx, cn } from "@follow/utils/utils"
import {
  HoverCard,
  HoverCardContent,
  HoverCardPortal,
  HoverCardTrigger,
} from "@radix-ui/react-hover-card"
import type { FC } from "react"
import * as React from "react"
import { useTranslation } from "react-i18next"

import {
  setUISetting,
  useIsZenMode,
  useRealInWideMode,
  useSetZenMode,
  useUISettingKey,
} from "~/atoms/settings/ui"
import { ImpressionView } from "~/components/common/ImpressionTracker"
import { shortcuts } from "~/constants/shortcuts"
import { useAIDailyReportModal } from "~/modules/ai/ai-daily/useAIDailyReportModal"

import { setMasonryColumnValue, useMasonryColumnValue } from "../atoms"

export const DailyReportButton: FC = () => {
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

export const FilterNoImageButton = () => {
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

export const SwitchToMasonryButton = () => {
  const isMasonry = useUISettingKey("pictureViewMasonry")
  const { t } = useTranslation()
  const isMobile = useMobile()

  const masonryColumnValue = useMasonryColumnValue()
  if (isMobile) return null
  return (
    <HoverCard>
      <HoverCardTrigger>
        <ActionButton
          onClick={() => {
            setUISetting("pictureViewMasonry", !isMasonry)
          }}
        >
          <i className={cn(!isMasonry ? "i-mgc-grid-cute-re" : "i-mgc-grid-2-cute-re")} />
        </ActionButton>
      </HoverCardTrigger>
      <HoverCardPortal>
        <HoverCardContent
          sideOffset={12}
          side="bottom"
          className={clsx(
            "z-10 rounded-xl border bg-background drop-shadow",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:slide-out-to-top-5 data-[state=open]:slide-in-from-top-5",
            "data-[state=closed]:slide-in-from-top-0 data-[state=open]:slide-in-from-top-0",
            "transition-all duration-200 ease-in-out",
            "px-3 py-2",
          )}
        >
          <AutoResizeHeight>
            <div className="flex flex-col gap-3">
              <div className="flex items-center">
                <label className="mr-2 w-[120px] text-sm">
                  {t("entry_list_header.preview_mode")}
                </label>
                <SegmentGroup
                  className="h-8"
                  value={isMasonry ? "masonry" : "grid"}
                  onValueChanged={(v) => {
                    setUISetting("pictureViewMasonry", v === "masonry")
                  }}
                >
                  <SegmentItem
                    key="Grid"
                    value="grid"
                    label={
                      <div className="flex items-center gap-1 text-sm">
                        <i className="i-mgc-grid-2-cute-re" />
                        <span>{t("entry_list_header.grid")}</span>
                      </div>
                    }
                  />
                  <SegmentItem
                    key="Masonry"
                    value="masonry"
                    label={
                      <div className="flex items-center gap-1 text-sm">
                        <i className="i-mgc-grid-cute-re" />
                        <span>{t("entry_list_header.masonry")}</span>
                      </div>
                    }
                  />
                </SegmentGroup>
              </div>

              {isMasonry && (
                <div className="flex gap-1">
                  <label className="mr-2 w-[200px] text-sm">
                    {t("entry_list_header.masonry_column")}
                  </label>
                  <Slider
                    variant="secondary"
                    min={1}
                    max={6}
                    step={1}
                    defaultValue={[masonryColumnValue]}
                    onValueCommit={(value) => {
                      setMasonryColumnValue(value[0])
                    }}
                  />
                </div>
              )}
            </div>
          </AutoResizeHeight>
        </HoverCardContent>
      </HoverCardPortal>
    </HoverCard>
  )
}

export const WideModeButton = () => {
  const isWideMode = useRealInWideMode()
  const isZenMode = useIsZenMode()
  const { t } = useTranslation()

  const setIsZenMode = useSetZenMode()
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
          if (isZenMode) {
            setIsZenMode(false)
          } else {
            setUISetting("wideMode", !isWideMode)
            // TODO: Remove this after useMeasure can get bounds in time
            window.dispatchEvent(new Event("resize"))
          }
          window.analytics?.capture("Switch to Wide Mode", {
            wideMode: !isWideMode ? 1 : 0,
            click: 1,
          })
        }}
        tooltip={
          isZenMode
            ? t("zen.exit")
            : !isWideMode
              ? t("entry_list_header.switch_to_widemode")
              : t("entry_list_header.switch_to_normalmode")
        }
      >
        {isZenMode ? (
          <MdiMeditation />
        ) : (
          <i
            className={cn(isWideMode ? "i-mgc-align-justify-cute-re" : "i-mgc-align-left-cute-re")}
          />
        )}
      </ActionButton>
    </ImpressionView>
  )
}

export const AppendTaildingDivider = ({ children }: { children: React.ReactNode }) => (
  <>
    {children}
    {React.Children.toArray(children).filter(Boolean).length > 0 && (
      <DividerVertical className="mx-2 w-px" />
    )}
  </>
)

export interface EntryListHeaderProps {
  refetch: () => void
  isRefreshing: boolean
  hasUpdate: boolean
}
