import { useAtomValue } from "jotai"
import { atomWithStorage, selectAtom } from "jotai/utils"
import { useMemo } from "react"

import { useRefValue } from "~/hooks/common"
import { EventBus } from "~/lib/event-bus"
import { createAtomHooks } from "~/lib/jotai"
import { getStorageNS } from "~/lib/ns"
import type { SettingItem } from "~/modules/settings/setting-builder"
import { createSettingBuilder } from "~/modules/settings/setting-builder"

declare module "~/lib/event-bus" {
  interface CustomEvent {
    SETTING_CHANGE_EVENT: {
      updated: number
      payload: Record<string, any>
      key: string
    }
  }
}

export const createSettingAtom = <T extends object>(
  settingKey: string,
  createDefaultSettings: () => T,
) => {
  const atom = atomWithStorage(getStorageNS(settingKey), createDefaultSettings(), undefined, {
    getOnInit: true,
  })

  const [, , useSettingValue, , getSettings, setSettings] = createAtomHooks(atom)

  const initializeDefaultSettings = () => {
    const currentSettings = getSettings()
    const defaultSettings = createDefaultSettings()
    if (typeof currentSettings !== "object") setSettings(defaultSettings)
    const newSettings = { ...defaultSettings, ...currentSettings }
    setSettings(newSettings)
  }

  const selectAtomCacheMap = {} as Record<keyof ReturnType<typeof getSettings>, any>

  const useSettingKey = <T extends keyof ReturnType<typeof getSettings>>(key: T) => {
    let selectedAtom = selectAtomCacheMap[key]
    if (!selectedAtom) {
      selectedAtom = selectAtom(atom, (s) => s[key])
      selectAtomCacheMap[key] = selectedAtom
    }

    return useAtomValue(selectedAtom)
  }

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
    const updated = Date.now()
    setSettings({
      ...getSettings(),
      [key]: value,

      updated,
    })

    EventBus.dispatch("SETTING_CHANGE_EVENT", {
      payload: { [key]: value },
      updated,
      key: settingKey,
    })
  }

  const clearSettings = () => {
    setSettings(createDefaultSettings())
  }

  Object.defineProperty(useSettingValue, "select", {
    value: useSettingSelector,
  })

  return {
    useSettingKey,
    useSettingSelector,
    setSetting,
    clearSettings,
    initializeDefaultSettings,

    useSettingValue,
    getSettings,

    settingAtom: atom,
  } as {
    useSettingKey: typeof useSettingKey
    useSettingSelector: typeof useSettingSelector
    setSetting: typeof setSetting
    clearSettings: typeof clearSettings
    initializeDefaultSettings: typeof initializeDefaultSettings
    useSettingValue: typeof useSettingValue & {
      select: <T extends keyof ReturnType<() => T>>(key: T) => Awaited<T[T]>
    }
    getSettings: typeof getSettings
    settingAtom: typeof atom
  }
}

export const createDefineSettingItem =
  <T>(_getSetting: () => T, setSetting: (key: any, value: Partial<T>) => void) =>
  <K extends keyof T>(
    key: K,
    options: {
      label: string
      description?: string | JSX.Element
      onChange?: (value: T[K]) => void
      hide?: boolean
    } & Omit<SettingItem<any>, "onChange" | "description" | "label" | "hide" | "key">,
  ): any => {
    const { label, description, onChange, hide, ...rest } = options

    return {
      key,
      label,
      description,
      onChange: (value: any) => {
        if (onChange) return onChange(value as any)
        setSetting(key, value as any)
      },
      disabled: hide,
      ...rest,
    } as SettingItem<any>
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
