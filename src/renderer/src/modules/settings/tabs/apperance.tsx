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
import { useQuery } from "@tanstack/react-query"
import { bundledThemes } from "shiki/themes"

import { SettingSwitch } from "../control"
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
              label="Dark Mode"
              checked={isDark}
              onCheckedChange={(e) => {
                if (ELECTRON) {
                  tipcClient?.setAppearance(e ? "dark" : "light")
                } else {
                  setDarkInWebApp(e ? "dark" : "light")
                }
              }}
            />,
            {
              label: "Opaque Sidebars",
              key: "opaqueSidebar",
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
                !ELECTRON || !["macOS", "Linux"].includes(getOS()),
              label: "Dock Badge",
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
              value: "Content",
            },
            !!ELECTRON && Fonts,

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
      <span className="shrink-0 text-sm font-medium">Code Highlight Theme</span>
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

const Fonts = () => {
  const { data } = useQuery({
    queryFn: () => tipcClient?.getSystemFonts(),
    queryKey: ["systemFonts"],
  })
  const readerFontFamily = useUISettingSelector(
    (state) => state.readerFontFamily || "SN Pro",
  )
  return (
    <div className="-mt-1 mb-3 flex items-center justify-between">
      <span className="shrink-0 text-sm font-medium">Font Family</span>
      <Select
        defaultValue="SN Pro"
        value={readerFontFamily}
        onValueChange={(value) => {
          setUISetting("readerFontFamily", value)
        }}
      >
        <SelectTrigger size="sm" className="w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="h-64">
          <SelectItem value="SN Pro">SN Pro</SelectItem>
          {data?.map((font) => (
            <SelectItem key={font} value={font}>
              {font}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

const textSizeMap = {
  tiny: 12,
  smaller: 14,
  default: 16,
  medium: 18,
  large: 20,
}

const TextSize = () => {
  const uiTextSize = useUISettingSelector((state) => state.uiTextSize)

  return (
    <div className="mt-1 flex items-center justify-between">
      <span className="shrink-0 text-sm font-medium">UI Text Size</span>
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
