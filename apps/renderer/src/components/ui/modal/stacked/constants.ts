import type { Target } from "framer-motion"

import { microReboundPreset } from "../../constants/spring"

const enterStyle: Target = {
  scale: 1,
  opacity: 1,
}
const initialStyle: Target = {
  scale: 0.96,
  opacity: 0,
}

export const modalMontionConfig = {
  initial: initialStyle,
  animate: enterStyle,
  exit: initialStyle,
  transition: microReboundPreset,
}

// Radix context menu z-index 999
export const MODAL_STACK_Z_INDEX = 1001
