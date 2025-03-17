import type { RouteProp } from "@react-navigation/native"
import { Text, View } from "react-native"

import { ModalHeader } from "@/src/components/layouts/header/ModalHeader"
import { SafeModalScrollView } from "@/src/components/layouts/views/SafeModalScrollView"
import { Select } from "@/src/components/ui/form/Select"
import { PlainTextField } from "@/src/components/ui/form/TextField"
import {
  GroupedInsetListBaseCell,
  GroupedInsetListCard,
  GroupedInsetListSectionHeader,
} from "@/src/components/ui/grouped/GroupedList"
import { views } from "@/src/constants/views"
import { useActionRuleCondition } from "@/src/store/action/hooks"
import { actionActions } from "@/src/store/action/store"
import type { ConditionIndex } from "@/src/store/action/types"
import { accentColor } from "@/src/theme/colors"

import { filterFieldOptions, filterOperatorOptions } from "../actions/constant"
import type { SettingsStackParamList } from "../types"

export function EditConditionScreen({
  route,
}: {
  route: RouteProp<SettingsStackParamList, "EditCondition">
}) {
  return (
    <SafeModalScrollView className="bg-system-grouped-background">
      <ModalHeader headerTitle="Edit Condition" />

      <ConditionForm index={route.params} />
    </SafeModalScrollView>
  )
}

function ConditionForm({ index }: { index: ConditionIndex }) {
  const item = useActionRuleCondition(index)!
  const currentField = filterFieldOptions.find((field) => field.value === item.field)
  const currentOperator = filterOperatorOptions.find((field) => field.value === item.operator)
  const currentView =
    currentField?.type === "view"
      ? views.find((view) => view.view === Number(item.value))
      : undefined

  return (
    <View className="mt-6">
      <GroupedInsetListSectionHeader label="Condition" />
      <GroupedInsetListCard>
        <GroupedInsetListBaseCell className="flex flex-row justify-between">
          <Text className="text-label">Field</Text>
          <Select
            options={filterFieldOptions}
            value={currentField?.value}
            onValueChange={(value) => {
              actionActions.pathCondition(index, {
                field: value as any,
              })
            }}
            wrapperClassName="min-w-48"
          />
        </GroupedInsetListBaseCell>

        <GroupedInsetListBaseCell className="flex flex-row justify-between">
          <Text className="text-label">Operator</Text>
          <Select
            options={filterOperatorOptions.filter((operator) =>
              operator.types.includes(currentField?.type ?? "text"),
            )}
            value={currentOperator?.value}
            onValueChange={(value) => {
              actionActions.pathCondition(index, {
                operator: value as any,
              })
            }}
            wrapperClassName="min-w-44"
          />
        </GroupedInsetListBaseCell>

        <GroupedInsetListBaseCell className="flex flex-row justify-between">
          <Text className="text-label">Value</Text>
          {currentField?.type === "view" ? (
            <Select
              options={views.map((field) => ({
                label: field.name,
                value: String(field.view),
              }))}
              value={currentView?.view ? String(currentView.view) : undefined}
              onValueChange={(val) => {
                actionActions.pathCondition(index, { value: val })
              }}
              wrapperClassName="min-w-40"
            />
          ) : (
            <PlainTextField
              className="w-full flex-1 text-right"
              value={item.value}
              onChangeText={(value) => {
                actionActions.pathCondition(index, { value })
              }}
              hitSlop={10}
              selectionColor={accentColor}
              placeholder="Enter value"
            />
          )}
        </GroupedInsetListBaseCell>
      </GroupedInsetListCard>
      {__DEV__ && (
        <View className="m-5">
          <Text className="text-label">{JSON.stringify(item)}</Text>
        </View>
      )}
    </View>
  )
}
