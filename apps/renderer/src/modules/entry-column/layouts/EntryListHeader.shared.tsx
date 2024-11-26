import { useMobile } from "@follow/components/hooks/useMobile.js"
import { MdiMeditation } from "@follow/components/icons/Meditation.js"
import { ActionButton } from "@follow/components/ui/button/index.js"
import { DividerVertical } from "@follow/components/ui/divider/Divider.js"
import { cn } from "@follow/utils/utils"
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

  if (isMobile) return null
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
