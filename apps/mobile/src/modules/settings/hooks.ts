import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { useContext } from "react"

import { SetBottomTabBarVisibleContext } from "@/src/contexts/BottomTabBarVisibleContext"

type RootStackParamList = {
  Account: undefined
}

export const useSettingsNavigation = () => {
  const setTabBarVisible = useContext(SetBottomTabBarVisibleContext)
  const hookValue = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  return {
    ...hookValue,
    navigate: (
      name: keyof RootStackParamList,
      params?: RootStackParamList[keyof RootStackParamList],
    ) => {
      setTabBarVisible(false)
      hookValue.navigate(name, params)
    },
  }
}
