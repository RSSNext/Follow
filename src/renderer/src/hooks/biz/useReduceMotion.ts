import { useUISettingKey } from "@renderer/atoms/ui"
import { useReducedMotion } from "framer-motion"

export const useReduceMotion = () => {
  const appReduceMotion = useUISettingKey("reduceMotion")
  const reduceMotion = useReducedMotion()
  return appReduceMotion || reduceMotion
}
