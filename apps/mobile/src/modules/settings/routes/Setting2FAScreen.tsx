import type { RouteProp } from "@react-navigation/native"
import { View } from "react-native"

import {
  NavigationBlurEffectHeader,
  SafeNavigationScrollView,
} from "@/src/components/layouts/views/SafeNavigationScrollView"

import type { SettingsStackParamList } from "../types"

export const Setting2FAScreen = ({
  route: _route,
}: {
  route: RouteProp<SettingsStackParamList, "Setting2FA">
}) => {
  return (
    <SafeNavigationScrollView>
      <NavigationBlurEffectHeader title="Setting 2FA" />

      <View className="my-12 items-center justify-center" />
    </SafeNavigationScrollView>
  )
}
