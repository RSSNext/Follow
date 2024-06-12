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
