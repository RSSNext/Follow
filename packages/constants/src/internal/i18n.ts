import { useTranslation } from "react-i18next"

import en from "../../../../locales/app/en.json"
import common_en from "../../../../locales/common/en.json"
import errors_en from "../../../../locales/errors/en.json"
import external_en from "../../../../locales/external/en.json"
import lang_en from "../../../../locales/lang/en.json"
import settings_en from "../../../../locales/settings/en.json"
import shortcuts_en from "../../../../locales/shortcuts/en.json"

const _defaultResources = {
  en: {
    app: en,
    lang: lang_en,
    common: common_en,
    external: external_en,
    settings: settings_en,
    shortcuts: shortcuts_en,
    errors: errors_en,
  },
}
declare module "i18next" {
  interface CustomTypeOptions {
    // ns: ["app", "common", "external", "lang", "settings", "shortcuts"]
    ns: ["app"]
    resources: (typeof _defaultResources)["en"]
    defaultNS: "app"
    // if you see an error like: "Argument of type 'DefaultTFuncReturn' is not assignable to parameter of type xyz"
    // set returnNull to false (and also in the i18next init options)
    // returnNull: false;
  }
}
// eslint-disable-next-line react-hooks/rules-of-hooks, unused-imports/no-unused-vars
const { t } = useTranslation()

export { type t }
