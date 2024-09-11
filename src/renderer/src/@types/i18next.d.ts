import type resources from "./resources"

declare module "i18next" {
  interface CustomTypeOptions {
    resources: (typeof resources)["en"]
    defaultNS: "translation"
    // if you see an error like: "Argument of type 'DefaultTFuncReturn' is not assignable to parameter of type xyz"
    // set returnNull to false (and also in the i18next init options)
    // returnNull: false;
  }
}
