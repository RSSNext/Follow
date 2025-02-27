import * as FileSystem from "expo-file-system"
import { Text, TouchableOpacity, View } from "react-native"

import {
  NavigationBlurEffectHeader,
  SafeNavigationScrollView,
} from "@/src/components/layouts/views/SafeNavigationScrollView"
import {
  GroupedInsetListBaseCell,
  GroupedInsetListCard,
  GroupedInsetListSectionHeader,
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
          <GroupedInsetListBaseCell>
            <TouchableOpacity
              onPress={async () => {
                await signOut()
                const dbPath = getDbPath()
                await FileSystem.deleteAsync(dbPath)
                await expo.reloadAppAsync("User sign out")
              }}
            >
              <Text className="text-red">Delete account</Text>
            </TouchableOpacity>
          </GroupedInsetListBaseCell>
        </GroupedInsetListCard>
      </View>
    </SafeNavigationScrollView>
  )
}
