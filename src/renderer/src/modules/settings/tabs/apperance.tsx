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
import { bundledThemes } from "shiki/themes"

import { SettingTabbedSegment } from "../control"
import { ContentFontSelector, UIFontSelector } from "../sections/fonts"
import { createSettingBuilder } from "../setting-builder"
import { SettingsTitle } from "../title"

const SettingBuilder = createSettingBuilder(useUISettingValue)
const defineItem = createDefineSettingItem(useUISettingValue, setUISetting)

export const SettingAppearance = () => (
  <>
    <SettingsTitle />
    <div className="mt-4">
      <SettingBuilder
        settings={[
          {
            type: "title",
            value: "General",
          },
          AppThemeSegment,

          defineItem("opaqueSidebar", {
            label: "Opaque sidebars",
            // hide: !window.electron || !["macOS", "Linux"].includes(getOS()),
            hide: !window.api?.canWindowBlur,
          }),

          {
            type: "title",
            value: "Unread count",
          },

          defineItem("showDockBadge", {
            label: "Show as Dock badge",
            hide: !window.electron || !["macOS", "Linux"].includes(getOS()),
          }),

          defineItem("sidebarShowUnreadCount", {
            label: "Show in sidebar",
          }),

          {
            type: "title",
            value: "Fonts",
          },
          TextSize,
          UIFontSelector,
          ContentFontSelector,
          {
            type: "title",
            value: "Content",
          },
          ShikiTheme,

          defineItem("guessCodeLanguage", {
            label: "Guess code language",
            hide: !isElectronBuild,
            description:
              "Major programming languages that use models to infer unlabeled code blocks",
          }),

          defineItem("readerRenderInlineStyle", {
            label: "Render inline style",
            description:
              "Allows rendering of the inline style of the original HTML.",
          }),
          {
            type: "title",
            value: "Misc",
          },

          defineItem("modalOverlay", {
            label: "Show modal overlay",
            description: "Show modal overlay",
          }),
          defineItem("reduceMotion", {
            label: "Reduce motion",
            description:
              "Reducing the motion of elements to improve performance and reduce energy consumption",
          }),
        ]}
      />
    </div>
  </>
)
const ShikiTheme = () => {
  const codeHighlightTheme = useUISettingKey("codeHighlightTheme")
  return (
    <div className="mb-3 flex items-center justify-between">
      <span className="shrink-0 text-sm font-medium">Code highlight theme</span>
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
  const uiTextSize = useUISettingSelector((state) => state.uiTextSize)

  return (
    <div className="-mt-1 mb-3 flex items-center justify-between">
      <span className="shrink-0 text-sm font-medium">Text size</span>
      <Select
        defaultValue={textSizeMap.default.toString()}
        value={uiTextSize.toString() || textSizeMap.default.toString()}
        onValueChange={(value) => {
          setUISetting(
            "uiTextSize",
            Number.parseInt(value) || textSizeMap.default,
          )
        }}
      >
        <SelectTrigger size="sm" className="w-48 capitalize">
          <SelectValue />
        </SelectTrigger>
        <SelectContent position="item-aligned">
          {Object.entries(textSizeMap).map(([size, value]) => (
            <SelectItem
              className="capitalize"
              key={size}
              value={value.toString()}
            >
              {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

const AppThemeSegment = () => {
  const theme = useThemeAtomValue()
  const setTheme = useSetTheme()

  return (
    <SettingTabbedSegment
      key="theme"
      label="Theme"
      value={theme}
      values={[
        {
          value: "system",
          label: "System",
          icon: <i className="i-mingcute-monitor-line" />,
        },
        {
          value: "light",
          label: "Light",
          icon: <i className="i-mingcute-sun-line" />,
        },
        {
          value: "dark",
          label: "Dark",
          icon: <i className="i-mingcute-moon-line" />,
        },
      ]}
      onValueChanged={(value) => {
        setTheme(value as "light" | "dark" | "system")
      }}
    />
  )
}
