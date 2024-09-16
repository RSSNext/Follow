import en from "../../../../locales/app/en.json"
import common_ardz from "../../../../locales/common/ar-dz.json"
import common_arma from "../../../../locales/common/ar-ma.json"
import common_arsa from "../../../../locales/common/ar-sa.json"
import common_en from "../../../../locales/common/en.json"
import common_es from "../../../../locales/common/es.json"
import common_fi from "../../../../locales/common/fi.json"
import common_fr from "../../../../locales/common/fr.json"
import common_ja from "../../../../locales/common/ja.json"
import common_pt from "../../../../locales/common/pt.json"
import common_zhCN from "../../../../locales/common/zh-CN.json"
import common_zhTW from "../../../../locales/common/zh-TW.json"
import external_en from "../../../../locales/external/en.json"
import lang_ardz from "../../../../locales/lang/ar-dz.json"
import lang_arma from "../../../../locales/lang/ar-ma.json"
import lang_arsa from "../../../../locales/lang/ar-sa.json"
import lang_en from "../../../../locales/lang/en.json"
import lang_es from "../../../../locales/lang/es.json"
import lang_fi from "../../../../locales/lang/fi.json"
import lang_fr from "../../../../locales/lang/fr.json"
import lang_ja from "../../../../locales/lang/ja.json"
import lang_pt from "../../../../locales/lang/pt.json"
import lang_zhCN from "../../../../locales/lang/zh-CN.json"
import lang_zhTW from "../../../../locales/lang/zh-TW.json"
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
  fi: { lang: lang_fi, common: common_fi },
  "ar-dz": { lang: lang_ardz, common: common_ardz },
  "ar-sa": { lang: lang_arsa, common: common_arsa },
  "ar-ma": { lang: lang_arma, common: common_arma },
  "zh-TW": { lang: lang_zhTW, common: common_zhTW },
  es: { lang: lang_es, common: common_es },
  fr: { lang: lang_fr, common: common_fr },
  pt: { lang: lang_pt, common: common_pt },
}
