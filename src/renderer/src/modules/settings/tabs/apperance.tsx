import { createDefineSettingItem } from "@renderer/atoms/settings/helper"
import {
  setUISetting,
  useUISettingKey,
  useUISettingSelector,
  useUISettingValue,
} from "@renderer/atoms/settings/ui"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@renderer/components/ui/select"
import { isElectronBuild } from "@renderer/constants"
import { useSetTheme, useThemeAtomValue } from "@renderer/hooks/common"
import { getOS } from "@renderer/lib/utils"
import { useTranslation } from "react-i18next"
import { bundledThemes } from "shiki/themes"

import { SettingTabbedSegment } from "../control"
import { ContentFontSelector, UIFontSelector } from "../sections/fonts"
import { createSettingBuilder } from "../setting-builder"
import { SettingsTitle } from "../title"

const SettingBuilder = createSettingBuilder(useUISettingValue)
const defineItem = createDefineSettingItem(useUISettingValue, setUISetting)

export const SettingAppearance = () => {
  const { t } = useTranslation()
  return (
    <>
      <SettingsTitle />
      <div className="mt-4">
        <SettingBuilder
          settings={[
            {
              type: "title",
              value: t("settings.appearance.general"),
            },
            AppThemeSegment,

            defineItem("opaqueSidebar", {
              label: t("settings.appearance.opaque_sidebars.label"),
              hide: !window.api?.canWindowBlur,
            }),

            {
              type: "title",
              value: t("settings.appearance.unread_count"),
            },

            defineItem("showDockBadge", {
              label: t("settings.appearance.show_dock_badge.label"),
              hide: !window.electron || !["macOS", "Linux"].includes(getOS()),
            }),

            defineItem("sidebarShowUnreadCount", {
              label: t("settings.appearance.sidebar_show_unread_count.label"),
            }),

            {
              type: "title",
              value: t("settings.appearance.fonts"),
            },
            TextSize,
            UIFontSelector,
            ContentFontSelector,
            {
              type: "title",
              value: t("settings.appearance.content"),
            },
            ShikiTheme,

            defineItem("guessCodeLanguage", {
              label: t("settings.appearance.guess_code_language.label"),
              hide: !isElectronBuild,
              description: t("settings.appearance.guess_code_language.description"),
            }),

            defineItem("readerRenderInlineStyle", {
              label: t("settings.appearance.reader_render_inline_style.label"),
              description: t("settings.appearance.reader_render_inline_style.description"),
            }),
            {
              type: "title",
              value: t("settings.appearance.misc"),
            },

            defineItem("modalOverlay", {
              label: t("settings.appearance.modal_overlay.label"),
              description: t("settings.appearance.modal_overlay.description"),
            }),
            defineItem("reduceMotion", {
              label: t("settings.appearance.reduce_motion.label"),
              description: t("settings.appearance.reduce_motion.description"),
            }),
          ]}
        />
      </div>
    </>
  )
}

const ShikiTheme = () => {
  const { t } = useTranslation()
  const codeHighlightTheme = useUISettingKey("codeHighlightTheme")
  return (
    <div className="mb-3 flex items-center justify-between">
      <span className="shrink-0 text-sm font-medium">
        {t("settings.appearance.code_highlight_theme")}
      </span>
      <Select
        defaultValue="github-dark"
        value={codeHighlightTheme}
        onValueChange={(value) => {
          setUISetting("codeHighlightTheme", value)
        }}
      >
        <SelectTrigger size="sm" className="w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent position="item-aligned">
          {Object.keys(bundledThemes)?.map((theme) => (
            <SelectItem key={theme} value={theme}>
              {theme}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

const textSizeMap = {
  smaller: 15,
  default: 16,
  medium: 18,
  large: 20,
}

const TextSize = () => {
  const { t } = useTranslation()
  const uiTextSize = useUISettingSelector((state) => state.uiTextSize)

  return (
    <div className="-mt-1 mb-3 flex items-center justify-between">
      <span className="shrink-0 text-sm font-medium">{t("settings.appearance.text_size")}</span>
      <Select
        defaultValue={textSizeMap.default.toString()}
        value={uiTextSize.toString() || textSizeMap.default.toString()}
        onValueChange={(value) => {
          setUISetting("uiTextSize", Number.parseInt(value) || textSizeMap.default)
        }}
      >
        <SelectTrigger size="sm" className="w-48 capitalize">
          <SelectValue />
        </SelectTrigger>
        <SelectContent position="item-aligned">
          {Object.entries(textSizeMap).map(([size, value]) => (
            <SelectItem className="capitalize" key={size} value={value.toString()}>
              {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

const AppThemeSegment = () => {
  const { t } = useTranslation()
  const theme = useThemeAtomValue()
  const setTheme = useSetTheme()

  return (
    <SettingTabbedSegment
      key="theme"
      label={t("settings.appearance.theme.label")}
      value={theme}
      values={[
        {
          value: "system",
          label: t("settings.appearance.theme.system"),
          icon: <i className="i-mingcute-monitor-line" />,
        },
        {
          value: "light",
          label: t("settings.appearance.theme.light"),
          icon: <i className="i-mingcute-sun-line" />,
        },
        {
          value: "dark",
          label: t("settings.appearance.theme.dark"),
          icon: <i className="i-mingcute-moon-line" />,
        },
      ]}
      onValueChanged={(value) => {
        setTheme(value as "light" | "dark" | "system")
      }}
    />
  )
}
