import { useIsFocused } from "@react-navigation/native"
import { useContext, useEffect } from "react"
import { View } from "react-native"

import {
  GroupedInsetListCard,
  GroupedInsetListNavigationLink,
} from "@/src/components/ui/grouped/GroupedList"
import { SetBottomTabBarVisibleContext } from "@/src/contexts/BottomTabBarVisibleContext"

import { useSettingsNavigation } from "./hooks"

export const SettingsList = () => {
  const navigation = useSettingsNavigation()

  const setTabBarVisible = useContext(SetBottomTabBarVisibleContext)
  const isVisible = useIsFocused()
  useEffect(() => {
    if (isVisible) {
      setTabBarVisible(true)
    }
  }, [isVisible, setTabBarVisible])
  return (
    <View className="bg-system-grouped-background flex-1 py-4">
      <GroupedInsetListCard>
        <GroupedInsetListNavigationLink
          label="Account"
          onPress={() => {
            navigation.navigate("Account")
          }}
        />
      </GroupedInsetListCard>
    </View>
  )
}
