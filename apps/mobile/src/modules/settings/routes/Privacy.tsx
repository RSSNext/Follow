import {
  NavigationBlurEffectHeader,
  SafeNavigationScrollView,
} from "@/src/components/layouts/views/SafeNavigationScrollView"
import {
  GroupedInsetListCard,
  GroupedInsetListNavigationLink,
} from "@/src/components/ui/grouped/GroupedList"
import { useNavigation } from "@/src/lib/navigation/hooks"
import { TermsScreen } from "@/src/screens/(headless)/terms"

export const PrivacyScreen = () => {
  const { pushControllerView } = useNavigation()
  return (
    <SafeNavigationScrollView className="bg-system-grouped-background">
      <NavigationBlurEffectHeader title="Privacy" />
      <GroupedInsetListCard className="mt-4">
        <GroupedInsetListNavigationLink
          label="Terms"
          onPress={() => {
            pushControllerView(TermsScreen)
          }}
        />
      </GroupedInsetListCard>
    </SafeNavigationScrollView>
  )
}
