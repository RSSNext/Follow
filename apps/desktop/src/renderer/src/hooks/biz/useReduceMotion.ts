import { useReducedMotion } from "framer-motion"

import { useUISettingKey } from "~/atoms/settings/ui"

export const useReduceMotion = () => {
  const appReduceMotion = useUISettingKey("reduceMotion")
  const reduceMotion = useReducedMotion()
  return appReduceMotion || reduceMotion
}
