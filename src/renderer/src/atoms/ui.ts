import { createAtomHooks } from "@renderer/lib/jotai"
import { getStorageNS } from "@renderer/lib/ns"
import { useAtomValue } from "jotai"
import { atomWithStorage, selectAtom } from "jotai/utils"
import { useMemo } from "react"
import { useEventCallback } from "usehooks-ts"

const atom = atomWithStorage(getStorageNS("ui"), {
  entryColWidth: 340,
  opaqueSidebar: false,
  readerFontFamily: "SN Pro",
  uiTextSize: 16,

  showDockBadge: true,
  sidebarShowUnreadCount: true,

  modalOverlay: true,
  modalDraggable: true,
  modalOpaque: true,
  readerRenderInlineStyle: false,
  codeHighlightTheme: "github-dark",
})
const [, , useUISettingValue, , getUISettings, setUISettings] =
  createAtomHooks(atom)

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
  const stableSelector = useEventCallback(selector)

  return useAtomValue(
    // @ts-expect-error
    useMemo(() => selectAtom(atom, stableSelector), [stableSelector]),
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
