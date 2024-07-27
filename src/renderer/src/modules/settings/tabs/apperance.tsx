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
import { useDark, useSetDarkInWebApp } from "@renderer/hooks/common"
import { tipcClient } from "@renderer/lib/client"
import { getOS } from "@renderer/lib/utils"
import { bundledThemes } from "shiki/themes"

import { SettingSwitch } from "../control"
import { ContentFontSelector, UIFontSelector } from "../modules/fonts"
import { createSettingBuilder } from "../setting-builder"
import { SettingsTitle } from "../title"

const SettingBuilder = createSettingBuilder(useUISettingValue)

export const SettingAppearance = () => {
  const isDark = useDark()

  const setDarkInWebApp = useSetDarkInWebApp()

  return (
    <>
      <SettingsTitle />
      <div className="mt-4">
        <SettingBuilder
          settings={[
            {
              type: "title",
              value: "General",
            },
            <SettingSwitch
              key="darkMode"
              label="Dark mode"
              checked={isDark}
              onCheckedChange={(e) => {
                if (window.electron) {
                  tipcClient?.setAppearance(e ? "dark" : "light")
                } else {
                  setDarkInWebApp(e ? "dark" : "light")
                }
              }}
            />,
            {
              label: "Opaque sidebars",
              key: "opaqueSidebar",
              disabled:
                !window.electron || !["macOS", "Linux"].includes(getOS()),
              onChange: (value) => setUISetting("opaqueSidebar", value),
            },
            {
              type: "title",
              value: "UI",
            },
            TextSize,
            {
              type: "title",
              value: "Display counts",
            },
            {
              disabled:
                !window.electron || !["macOS", "Linux"].includes(getOS()),
              label: "Show Dock badge",
              key: "showDockBadge",
              onChange: (value) => setUISetting("showDockBadge", value),
            },
            {
              label: "Show sidebar unread count",
              key: "sidebarShowUnreadCount",
              onChange: (value) =>
                setUISetting("sidebarShowUnreadCount", value),
            },
            {
              type: "title",
              value: "Fonts",
            },
            UIFontSelector,
            ContentFontSelector,
            {
              type: "title",
              value: "Content",
            },
            ShikiTheme,
            {
              label: "Render inline style",
              key: "readerRenderInlineStyle",
              onChange: (value) =>
                setUISetting("readerRenderInlineStyle", value),
            },
            {
              type: "title",
              value: "Misc",
            },
            {
              label: "Show modal overlay",
              key: "modalOverlay",
              onChange: (value) => setUISetting("modalOverlay", value),
            },
            {
              label: "Reduce motion",
              key: "reduceMotion",
              onChange: (value) => setUISetting("reduceMotion", value),
              description: `Enabling this option will reduce the motion of the element to improve performance and device life, and if it is disabled, it will adapt to the system settings.`,
            },
          ]}
        />
      </div>
    </>
  )
}
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
        <SelectContent className="h-64">
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
    <div className="mt-1 flex items-center justify-between">
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
        <SelectTrigger size="sm" className="w-24 capitalize">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
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
