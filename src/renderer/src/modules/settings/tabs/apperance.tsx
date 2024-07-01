import {
  setUISetting,
  useUISettingKey,
  useUISettingSelector,
  useUISettingValue,
} from "@renderer/atoms"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@renderer/components/ui/select"
import { useDark } from "@renderer/hooks"
import { tipcClient } from "@renderer/lib/client"
import { getOS } from "@renderer/lib/utils"
import { useQuery } from "@tanstack/react-query"
import { useCallback } from "react"
import { bundledThemes } from "shiki/themes"

import { SettingDescription, SettingSwitch } from "../control"
import { SettingSectionTitle } from "../section"
import { SettingsTitle } from "../title"

export const SettingAppearance = () => {
  const { isDark, toggleDark } = useDark()
  const saveDarkSetting = useCallback(() => {
    toggleDark()
  }, [])

  const state = useUISettingValue()
  const onlyMacos = window.electron && getOS() === "macOS"

  return (
    <div>
      <SettingsTitle />
      <SettingSectionTitle title="General" />
      <SettingSwitch
        label="Dark Mode"
        checked={isDark}
        onCheckedChange={saveDarkSetting}
      />
      {onlyMacos && (
        <SettingSwitch
          label="Opaque Sidebars"
          checked={state.opaqueSidebar}
          onCheckedChange={(checked) => {
            setUISetting("opaqueSidebar", checked)
          }}
        />
      )}

      <SettingSectionTitle title="UI" />

      <TextSize />
      <SettingSectionTitle title="Display counts" />
      {onlyMacos && (
        <SettingSwitch
          label="Dock Badge"
          checked={state.showDockBadge}
          onCheckedChange={(c) => {
            setUISetting("showDockBadge", c)
          }}
        />
      )}
      <SettingSwitch
        label="Show sidebar unread count"
        checked={state.sidebarShowUnreadCount}
        onCheckedChange={(c) => {
          setUISetting("sidebarShowUnreadCount", c)
        }}
      />

      {/* <SettingSwitch
        label="Modal draggable"
        checked={state.modalDraggable}
        onCheckedChange={(c) => {
          setUISetting("modalDraggable", c)
        }}
      /> */}
      {/* <SettingSwitch
        label="Modal opaque"
        checked={state.modalOpaque}
        onCheckedChange={(c) => {
          setUISetting("modalOpaque", c)
        }}
      /> */}

      <SettingSectionTitle title="Content" />
      {window.electron && <Fonts />}
      <ShikiTheme />
      <SettingSwitch
        label="Render inline style"
        checked={state.readerRenderInlineStyle}
        onCheckedChange={(c) => {
          setUISetting("readerRenderInlineStyle", c)
        }}
      />

      <SettingSectionTitle title="Misc" />
      <SettingSwitch
        label="Show modal overlay"
        checked={state.modalOverlay}
        onCheckedChange={(c) => {
          setUISetting("modalOverlay", c)
        }}
      />
      <SettingSwitch
        label="Reduce motion"
        checked={state.reduceMotion}
        onCheckedChange={(c) => {
          setUISetting("reduceMotion", c)
        }}
      />
      <SettingDescription>
        Enabling this option will reduce the motion of the element to improve
        performance and device life, and if it is disabled, it will adapt to the
        system settings.
      </SettingDescription>
    </div>
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
