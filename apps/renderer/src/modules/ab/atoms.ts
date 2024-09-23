import FEATURES from "@constants/flags.json"
import { atom } from "jotai"
import { atomWithStorage } from "jotai/utils"

import { getStorageNS } from "~/lib/ns"

export type FeatureKeys = keyof typeof FEATURES

export const debugFeaturesAtom = atomWithStorage(getStorageNS("ab"), FEATURES, undefined, {
  getOnInit: true,
})

export const IS_DEBUG_ENV = import.meta.env.DEV || import.meta.env["PREVIEW_MODE"]

export const enableDebugOverrideAtom = atom(IS_DEBUG_ENV)
