import type { RouteProp } from "@react-navigation/native"
import { Text } from "react-native"

import { ModalHeader } from "@/src/components/layouts/header/ModalHeader"
import { SafeModalScrollView } from "@/src/components/layouts/views/SafeModalScrollView"
import { PlainTextField } from "@/src/components/ui/form/TextField"
import {
  GroupedInsetListBaseCell,
  GroupedInsetListCard,
  GroupedInsetListSectionHeader,
  GroupedPlainButtonCell,
} from "@/src/components/ui/grouped/GroupedList"
import type { NavigationControllerView } from "@/src/lib/navigation/types"
import { useActionRule } from "@/src/store/action/hooks"
import { actionActions } from "@/src/store/action/store"

import type { SettingsStackParamList } from "../types"

export const EditRewriteRulesScreen: NavigationControllerView<{ index: number }> = ({ index }) => {
  const rule = useActionRule(index)

  return (
    <SafeModalScrollView className="bg-system-grouped-background">
      <ModalHeader headerTitle="Edit Rewrite Rules" />
      <GroupedInsetListSectionHeader label="Rewrite Rules" />
      {rule?.result.rewriteRules?.map((rewriteRule, rewriteRuleIndex) => (
        <GroupedInsetListCard key={rewriteRuleIndex} className="mb-4">
          <GroupedInsetListBaseCell className="flex-row">
            <Text>From</Text>
            <PlainTextField
              className="w-full flex-1 text-right"
              value={rewriteRule.from}
              onChangeText={(value) => {
                actionActions.updateRewriteRule({
                  index,
                  rewriteRuleIndex,
                  key: "from",
                  value,
                })
              }}
            />
          </GroupedInsetListBaseCell>
          <GroupedInsetListBaseCell className="flex-row">
            <Text>To</Text>
            <PlainTextField
              className="w-full flex-1 text-right"
              value={rewriteRule.to}
              onChangeText={(value) => {
                actionActions.updateRewriteRule({
                  index,
                  rewriteRuleIndex,
                  key: "to",
                  value,
                })
              }}
            />
          </GroupedInsetListBaseCell>
        </GroupedInsetListCard>
      ))}
      <GroupedInsetListCard>
        <GroupedPlainButtonCell
          label="Add"
          onPress={() => {
            actionActions.addRewriteRule(index)
          }}
        />
      </GroupedInsetListCard>
      {__DEV__ && <Text>{JSON.stringify(rule?.result.rewriteRules, null, 2)}</Text>}
    </SafeModalScrollView>
  )
}
