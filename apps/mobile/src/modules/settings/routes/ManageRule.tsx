import type { RouteProp } from "@react-navigation/native"
import { Text, View } from "react-native"

import {
  NavigationBlurEffectHeader,
  SafeNavigationScrollView,
} from "@/src/components/layouts/views/SafeNavigationScrollView"
import { PlainTextField } from "@/src/components/ui/form/TextField"
import { GroupedInsetListCard, GroupedInsetListCell } from "@/src/components/ui/grouped/GroupedList"
import { useActionRule } from "@/src/store/action/hooks"
import { actionActions } from "@/src/store/action/store"
import type { ActionRule } from "@/src/store/action/types"
import { accentColor } from "@/src/theme/colors"

import type { SettingsStackParamList } from "../types"

export const ManageRuleScreen = ({
  route,
}: {
  route: RouteProp<SettingsStackParamList, "ManageRule">
}) => {
  const { index } = route.params
  const rule = useActionRule(index)

  return (
    <SafeNavigationScrollView
      className="bg-system-grouped-background"
      contentContainerClassName="mt-6"
    >
      <NavigationBlurEffectHeader
        title={index !== undefined ? `Edit Rule - ${rule?.name}` : "Create Rule"}
      />
      <RuleImpl index={index} />
    </SafeNavigationScrollView>
  )
}

const RuleImpl: React.FC<{ index?: number }> = ({ index }) => {
  const rule = useActionRule(index)

  return (
    <View>
      <GroupedInsetListCard>
        {rule ? <EditRuleNameSection rule={rule} /> : <Text>No rule available</Text>}
      </GroupedInsetListCard>
    </View>
  )
}

const EditRuleNameSection: React.FC<{ rule: ActionRule }> = ({ rule }) => {
  return (
    <GroupedInsetListCell label="Name" leftClassName="flex-none" rightClassName="flex-1">
      <View className="flex-1">
        <PlainTextField
          className="text-secondary-label w-full flex-1 text-right"
          value={rule.name}
          hitSlop={10}
          selectionColor={accentColor}
          onChangeText={(text) => {
            actionActions.patchRule(rule.index, { name: text })
          }}
        />
      </View>
    </GroupedInsetListCell>
  )
}
