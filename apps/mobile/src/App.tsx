import { useColorScheme } from "nativewind"
import { View } from "react-native"

import { FullWindowOverlay } from "./components/common/FullWindowOverlay"
import { useIntentHandler } from "./hooks/useIntentHandler"
import { DebugButton, EnvProfileIndicator } from "./modules/debug"
import { useOnboarding, usePrefetchSessionUser } from "./store/user/hooks"

export function App({ children }: { children: React.ReactNode }) {
  useColorScheme()
  useIntentHandler()
  useOnboarding()

  return (
    <View className="flex-1 bg-black">
      <Session />

      {children}
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
