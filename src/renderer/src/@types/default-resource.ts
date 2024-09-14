import en from "../../../../locales/app/en.json"
import common_en from "../../../../locales/common/en.json"
import common_ja from "../../../../locales/common/ja.json"
import common_ru from "../../../../locales/common/ru.json"
import common_zhCN from "../../../../locales/common/zh-CN.json"
import external_en from "../../../../locales/external/en.json"
import lang_en from "../../../../locales/lang/en.json"
import lang_ja from "../../../../locales/lang/ja.json"
import lang_ru from "../../../../locales/lang/ru.json"
import lang_zhCN from "../../../../locales/lang/zh-CN.json"
import settings_en from "../../../../locales/settings/en.json"
import shortcuts_en from "../../../../locales/shortcuts/en.json"
/**
 * This file is the language resource that is loaded in full when the app is initialized.
 * When switching languages, the app will automatically download the required language resources,
 * we will not load all the language resources to minimize the first screen loading time of the app.
 * Generally, we only load english resources synchronously by default.
 * In addition, we attach common resources for other languages, and the size of the common resources must be controlled.
 */
export const defaultResources = {
  en: {
    app: en,
    lang: lang_en,
    common: common_en,
    external: external_en,
    settings: settings_en,
    shortcuts: shortcuts_en,
  },
  "zh-CN": {
    lang: lang_zhCN,
    common: common_zhCN,
  },
  ja: {
    lang: lang_ja,
    common: common_ja,
  },
  ru: { lang: lang_ru, common: common_ru },
}
