import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"

import type { SettingsStackParamList } from "./types"

export const useSettingsNavigation = () => {
  return useNavigation<NativeStackNavigationProp<SettingsStackParamList>>()
}
