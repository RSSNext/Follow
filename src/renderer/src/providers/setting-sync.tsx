import { langLoadingLockMapAtom } from "@renderer/atoms/lang"
import { useGeneralSettingKey } from "@renderer/atoms/settings/general"
import { useUISettingValue } from "@renderer/atoms/settings/ui"
import { useReduceMotion } from "@renderer/hooks/biz/useReduceMotion"
import { useSyncThemeark } from "@renderer/hooks/common"
import { tipcClient } from "@renderer/lib/client"
import { loadLanguageAndApply } from "@renderer/lib/load-language"
import { feedUnreadActions } from "@renderer/store/unread"
import i18next from "i18next"
import { useSetAtom } from "jotai"
import { useEffect, useInsertionEffect, useLayoutEffect } from "react"

const useUISettingSync = () => {
  const setting = useUISettingValue()
  useSyncThemeark()
  useInsertionEffect(() => {
    const root = document.documentElement
    root.style.fontSize = `${setting.uiTextSize}px`
  }, [setting.uiTextSize])

  useInsertionEffect(() => {
    const root = document.documentElement

    const fontCss = `${setting.uiFontFamily},"SN Pro", system-ui, sans-serif`
    Object.assign(root.style, {
      fontFamily: fontCss,
    })
    root.style.cssText += `\n--fo-font-family: ${fontCss}`
    Object.assign(document.body.style, {
      fontFamily: fontCss,
    })
  }, [setting.uiFontFamily])

  useEffect(() => {
    if (setting.showDockBadge) {
      return feedUnreadActions.subscribeUnreadCount(
        (count) => tipcClient?.setDockBadge(count),
        true,
      )
    } else {
      tipcClient?.setDockBadge(0)
    }
    return
  }, [setting.showDockBadge])

  useEffect(() => {
    if (setting.voice) {
      tipcClient?.setVoice(setting.voice)
    }
  }, [setting.voice])
}

const useUXSettingSync = () => {
  const reduceMotion = useReduceMotion()
  useLayoutEffect(() => {
    document.documentElement.dataset.motionReduce = reduceMotion ? "true" : "false"
  }, [reduceMotion])
}

const useLanguageSync = () => {
  const setLoadingLanguageLockMap = useSetAtom(langLoadingLockMapAtom)
  const language = useGeneralSettingKey("language")
  useEffect(() => {
    setLoadingLanguageLockMap((state) => ({ ...state, [language]: true }))
    loadLanguageAndApply(language as string)
      .then(() => {
        i18next.changeLanguage(language as string)
      })
      .finally(() => {
        setLoadingLanguageLockMap((state) => ({ ...state, [language]: false }))
      })
  }, [setLoadingLanguageLockMap, language])
}
export const SettingSync = () => {
  useUISettingSync()
  useUXSettingSync()
  useLanguageSync()
  return null
}
