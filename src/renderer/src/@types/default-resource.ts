import en from "../../../../locales/en.json"
import common_en from "../../../../locales/namespaces/common/en.json"
import common_zhCN from "../../../../locales/namespaces/common/zh_CN.json"
import lang_en from "../../../../locales/namespaces/lang/en.json"

/**
 * This file is the language resource that is loaded in full when the app is initialized.
 * When switching languages, the app will automatically download the required language resources,
 * we will not load all the language resources to minimize the first screen loading time of the app.
 * Generally, we only load english resources synchronously by default.
 * In addition, we attach common resources for other languages, and the size of the common resources must be controlled.
 */

export const defaultResources = {
  en: {
    translation: en,
    lang: lang_en,
    common: common_en,
  },

  zh_CN: {
    common: common_zhCN,
  },
}
