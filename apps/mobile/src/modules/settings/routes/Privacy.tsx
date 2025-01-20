import { router } from "expo-router"

import {
  NavigationBlurEffectHeader,
  SafeNavigationScrollView,
} from "@/src/components/common/SafeNavigationScrollView"
import {
  GroupedInsetListCard,
  GroupedInsetListNavigationLink,
} from "@/src/components/ui/grouped/GroupedList"

export const PrivacyScreen = () => {
  return (
    <SafeNavigationScrollView className="bg-system-grouped-background">
      <NavigationBlurEffectHeader title="Privacy" />
      <GroupedInsetListCard>
        <GroupedInsetListNavigationLink
          label="Teams"
          onPress={() => {
            router.push("/teams")
          }}
        />
      </GroupedInsetListCard>
    </SafeNavigationScrollView>
  )
}
