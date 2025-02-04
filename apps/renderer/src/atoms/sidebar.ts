import { atom } from "jotai"

import { createAtomHooks } from "~/lib/jotai"

import { getIsZenMode, useIsZenMode } from "./settings/ui"

const [, , internal_useFeedColumnShow, , internal_getFeedColumnShow, setFeedColumnShow] =
  createAtomHooks(atom(true))

export const useFeedColumnShow = () => {
  const isZenMode = useIsZenMode()
  return internal_useFeedColumnShow() && !isZenMode
}

export const getFeedColumnShow = () => {
  const isZenMode = getIsZenMode()
  return internal_getFeedColumnShow() && !isZenMode
}

export { setFeedColumnShow }

export const [, , useFeedColumnTempShow, , getFeedColumnTempShow, setFeedColumnTempShow] =
  createAtomHooks(atom(false))
