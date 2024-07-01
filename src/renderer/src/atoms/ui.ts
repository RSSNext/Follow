import { useRefValue } from "@renderer/hooks"
import { createAtomHooks } from "@renderer/lib/jotai"
import { getStorageNS } from "@renderer/lib/ns"
import { useAtomValue } from "jotai"
import { atomWithStorage, selectAtom } from "jotai/utils"
import { useMemo } from "react"

const createDefaultSettings = () => ({
  // Sidebar
  entryColWidth: 340,
  opaqueSidebar: false,
  sidebarShowUnreadCount: true,

  // Global UI
  uiTextSize: 16,
  // System
  showDockBadge: true,
  // Misc
  modalOverlay: true,
  modalDraggable: true,
  modalOpaque: true,
  reduceMotion: false,

  // Content
  readerFontFamily: "SN Pro",
  readerRenderInlineStyle: false,
  codeHighlightTheme: "github-dark",
})
const atom = atomWithStorage(
  getStorageNS("ui"),
  createDefaultSettings(),
  undefined,
  {
    getOnInit: true,
  },
)
const [, , useUISettingValue, , getUISettings, setUISettings] =
  createAtomHooks(atom)

export const initializeDefaultUISettings = () => {
  const currentSettings = getUISettings()
  const defaultSettings = createDefaultSettings()
  if (typeof currentSettings !== "object") setUISettings(defaultSettings)
  const newSettings = { ...defaultSettings, ...currentSettings }
  setUISettings(newSettings)
}

export { getUISettings, useUISettingValue }
export const useUISettingKey = <
  T extends keyof ReturnType<typeof getUISettings>,
>(
    key: T,
  ) => useAtomValue(useMemo(() => selectAtom(atom, (s) => s[key]), [key]))

export const useUISettingSelector = <
  T extends keyof ReturnType<typeof getUISettings>,
  S extends ReturnType<typeof getUISettings>,
  R = S[T],
>(
    selector: (s: S) => R,
  ): R => {
  const stableSelector = useRefValue(selector)

  return useAtomValue(
    // @ts-expect-error
    useMemo(() => selectAtom(atom, stableSelector.current), [stableSelector]),
  )
}

export const setUISetting = <K extends keyof ReturnType<typeof getUISettings>>(
  key: K,
  value: ReturnType<typeof getUISettings>[K],
) => {
  setUISettings({
    ...getUISettings(),
    [key]: value,
  })
}

export const clearUISettings = () => {
  setUISettings(createDefaultSettings())
}
