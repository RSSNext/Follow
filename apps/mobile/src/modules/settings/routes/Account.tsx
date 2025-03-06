import * as FileSystem from "expo-file-system"
import { Alert, View } from "react-native"

import {
  NavigationBlurEffectHeader,
  SafeNavigationScrollView,
} from "@/src/components/layouts/views/SafeNavigationScrollView"
import {
  GroupedInsetListCard,
  GroupedInsetListSectionHeader,
  GroupedPlainButtonCell,
} from "@/src/components/ui/grouped/GroupedList"
import { getDbPath } from "@/src/database"
import { signOut } from "@/src/lib/auth"

export const AccountScreen = () => {
  return (
    <SafeNavigationScrollView className="bg-system-grouped-background">
      <NavigationBlurEffectHeader title="Account" />
      {/* Language */}
      <View className="mt-6">
        <GroupedInsetListSectionHeader label="Danger Zone" />
        <GroupedInsetListCard>
          <GroupedPlainButtonCell
            label="Delete account"
            textClassName="text-red text-left"
            onPress={async () => {
              Alert.alert("Delete account", "Are you sure you want to delete your account?", [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Delete",
                  style: "destructive",
                  onPress: async () => {
                    await signOut()
                    const dbPath = getDbPath()
                    await FileSystem.deleteAsync(dbPath)
                    await expo.reloadAppAsync("User sign out")
                  },
                },
              ])
            }}
          />
        </GroupedInsetListCard>
      </View>
    </SafeNavigationScrollView>
  )
}
