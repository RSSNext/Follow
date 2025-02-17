import type { SpringConfig } from "react-native-reanimated/lib/typescript/animation/springUtils"

export const gentleSpringPreset: SpringConfig = {
  damping: 15,
  stiffness: 100,
  mass: 1,
}
