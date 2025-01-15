import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"

type RootStackParamList = {
  Account: undefined
}

export const useSettingsNavigation = () => {
  return useNavigation<NativeStackNavigationProp<RootStackParamList>>()
}
