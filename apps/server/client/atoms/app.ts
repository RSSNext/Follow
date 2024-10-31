import { createAtomHooks } from "@follow/utils/jotai"
import { atom } from "jotai"

type Deeplink = {
  deeplink: string
  fallbackUrl?: string
}
export const [, , useOpenInAppDeeplink, , getOpenInAppDeeplink, setOpenInAppDeeplink] =
  createAtomHooks(atom<Deeplink | null>(null))
