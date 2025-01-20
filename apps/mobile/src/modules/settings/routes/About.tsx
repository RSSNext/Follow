import { Text, View } from "react-native"

import {
  NavigationBlurEffectHeader,
  SafeNavigationScrollView,
} from "@/src/components/common/SafeNavigationScrollView"

export const AboutScreen = () => {
  return (
    <SafeNavigationScrollView className="bg-system-grouped-background">
      <NavigationBlurEffectHeader title="About" />
      <View className="flex-1 items-center justify-center">
        <Text>About</Text>
      </View>
    </SafeNavigationScrollView>
  )
}
