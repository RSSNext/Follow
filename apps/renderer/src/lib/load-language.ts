import { IN_ELECTRON } from "@follow/shared/constants"
import { getOS, isEmptyObject } from "@follow/utils/utils"
import dayjs from "dayjs"
import i18next from "i18next"
import { toast } from "sonner"

import { currentSupportedLanguages, dayjsLocaleImportMap } from "~/@types/constants"
import { defaultResources } from "~/@types/default-resource"
import { fallbackLanguage, i18nAtom, langChain, LocaleCache } from "~/i18n"
import { jotaiStore } from "~/lib/jotai"

import { tipcClient } from "./client"
import { appLog } from "./log"

const loadingLangLock = new Set<string>()
const loadedLangs = new Set<string>([fallbackLanguage])

export const loadLanguageAndApply = async (lang: string) => {
  const dayjsImport = dayjsLocaleImportMap[lang]

  if (dayjsImport) {
    const [locale, loader] = dayjsImport
    loader().then(() => {
      appLog("dayjs loaded: ", locale)
      langChain.next(() => {
        return dayjs.locale(locale)
      })
    })
  }

  tipcClient?.switchAppLocale(lang)

  const { t } = jotaiStore.get(i18nAtom)
  if (loadingLangLock.has(lang)) return
  const isSupport = currentSupportedLanguages.includes(lang)
  if (!isSupport) {
    return
  }
  const loaded = loadedLangs.has(lang)

  if (loaded) {
    return
  }

  loadingLangLock.add(lang)

  if (import.meta.env.DEV) {
    const nsGlobbyMap = import.meta.glob("@locales/*/*.json")

    const namespaces = Object.keys(defaultResources.en)

    const res = await Promise.allSettled(
      namespaces.map(async (ns) => {
        const loader = nsGlobbyMap[`../../locales/${ns}/${lang}.json`]

        if (!loader) return
        const nsResources = await loader().then((m: any) => m.default)

        i18next.addResourceBundle(lang, ns, nsResources, true, true)
      }),
    )

    for (const r of res) {
      if (r.status === "rejected") {
        toast.error(`${t("common:tips.load-lng-error")}: ${lang}`)
        loadingLangLock.delete(lang)

        return
      }
    }
  } else {
    let importFilePath = ""

    if (IN_ELECTRON) {
      importFilePath =
        (await tipcClient?.resolveAppAsarPath(`dist/renderer/locales/${lang}.js`)) || ""

      // FUCK windows
      if (getOS() === "Windows") {
        importFilePath = importFilePath.replaceAll("\\", "/")
      }
    } else {
      importFilePath = `/locales/${lang}.js`
    }
    const res = await eval(`import('${importFilePath}')`)
      .then((res: any) => res?.default || res)
      .catch(() => {
        toast.error(`${t("common:tips.load-lng-error")}: ${lang}`)
        loadingLangLock.delete(lang)
        return {}
      })

    if (isEmptyObject(res)) {
      return
    }
    for (const namespace in res) {
      i18next.addResourceBundle(lang, namespace, res[namespace], true, true)
    }
  }

  await i18next.reloadResources()

  LocaleCache.shared.set(lang)
  loadedLangs.add(lang)
  loadingLangLock.delete(lang)
}
