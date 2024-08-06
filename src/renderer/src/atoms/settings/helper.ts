import { useRefValue } from "@renderer/hooks/common"
import { createAtomHooks } from "@renderer/lib/jotai"
import { getStorageNS } from "@renderer/lib/ns"
import { createSettingBuilder } from "@renderer/modules/settings/setting-builder"
import { useAtomValue } from "jotai"
import { atomWithStorage, selectAtom } from "jotai/utils"
import { useMemo } from "react"

export const createSettingAtom = <T extends object>(
  settingKey: string,
  createDefaultSettings: () => T,
) => {
  const atom = atomWithStorage(
    getStorageNS(settingKey),
    createDefaultSettings(),
    undefined,
    {
      getOnInit: true,
    },
  )
  const [, , useSettingValue, , getSettings, setSettings] =
    createAtomHooks(atom)

  const initializeDefaultSettings = () => {
    const currentSettings = getSettings()
    const defaultSettings = createDefaultSettings()
    if (typeof currentSettings !== "object") setSettings(defaultSettings)
    const newSettings = { ...defaultSettings, ...currentSettings }
    setSettings(newSettings)
  }

  const useSettingKey = <T extends keyof ReturnType<typeof getSettings>>(
    key: T,
  ) => useAtomValue(useMemo(() => selectAtom(atom, (s) => s[key]), [key]))

  const useSettingSelector = <
    T extends keyof ReturnType<typeof getSettings>,
    S extends ReturnType<typeof getSettings>,
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

  const setSetting = <K extends keyof ReturnType<typeof getSettings>>(
    key: K,
    value: ReturnType<typeof getSettings>[K],
  ) => {
    setSettings({
      ...getSettings(),
      [key]: value,
    })
  }

  const clearSettings = () => {
    setSettings(createDefaultSettings())
  }

  return {
    useSettingKey,
    useSettingSelector,
    setSetting,
    clearSettings,
    initializeDefaultSettings,

    useSettingValue,
    getSettings,

    settingAtom: atom,
  }
}

export const createDefineSettingItem =
  <T>(
    _getSetting: () => T,
    setSetting: (key: any, value: Partial<T>) => void,
  ) =>
  <K extends keyof T>(
      key: K,
      options: {
        label: string
        description?: string
        onChange?: (value: T[K]) => void
      },
    ) => {
    const { label, description, onChange } = options
    return {
      key,
      label,
      description,
      onChange: (value: any) => {
        if (onChange) return onChange(value as any)
        setSetting(key, value as any)
      },
    } as any
  }

export const createSetting = <T extends object>(
  useSetting: () => T,
  setSetting: (key: any, value: Partial<T>) => void,
) => {
  const SettingBuilder = createSettingBuilder(useSetting)
  const defineSettingItem = createDefineSettingItem(useSetting, setSetting)
  return {
    SettingBuilder,
    defineSettingItem,
  }
}
