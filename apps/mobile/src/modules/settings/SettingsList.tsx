import { View } from "react-native"

import {
  GroupedInsetListCard,
  GroupedInsetListNavigationLink,
} from "@/src/components/ui/grouped/GroupedList"

import { useSettingsNavigation } from "./hooks"

export const SettingsList = () => {
  const navigation = useSettingsNavigation()

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
