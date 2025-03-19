import { View } from "react-native"
import Animated, { interpolate, useAnimatedStyle } from "react-native-reanimated"
import { useSheet } from "react-native-sheet-transitions"

import { FullWindowOverlay } from "./components/common/FullWindowOverlay"
import { useIntentHandler } from "./hooks/useIntentHandler"
import { DebugButton, EnvProfileIndicator } from "./modules/debug"
import { useOnboarding, usePrefetchSessionUser } from "./store/user/hooks"

export function App({ children }: { children: React.ReactNode }) {
  useIntentHandler()
  useOnboarding()
  const { scale } = useSheet()

  const style = useAnimatedStyle(() => ({
    borderRadius: interpolate(scale.value, [0.8, 0.99, 1], [0, 50, 0]),
    transform: [
      {
        scale: scale.value,
      },
    ],
  }))
  return (
    <View className="flex-1 bg-black">
      <Session />

      <Animated.View className="flex-1 overflow-hidden" style={style}>
        {children}
      </Animated.View>
      {__DEV__ && <DebugButton />}
      <FullWindowOverlay>
        <EnvProfileIndicator />
      </FullWindowOverlay>
    </View>
  )
}

const Session = () => {
  usePrefetchSessionUser()
  return null
}
