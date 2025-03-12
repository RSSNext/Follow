import type { RouteProp } from "@react-navigation/native"
import { Text, View } from "react-native"
import * as DropdownMenu from "zeego/dropdown-menu"

import { ModalHeader } from "@/src/components/layouts/header/ModalHeader"
import { SafeModalScrollView } from "@/src/components/layouts/views/SafeModalScrollView"
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

export function ManageConditionScreen({
  route,
}: {
  route: RouteProp<SettingsStackParamList, "ManageCondition">
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
    <>
      <GroupedInsetListSectionHeader label="Condition" />
      <GroupedInsetListCard>
        <GroupedInsetListBaseCell className="flex flex-row justify-between">
          <Text className="text-label">Field</Text>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <Text className="text-label">{currentField?.label || "Select"}</Text>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              {filterFieldOptions.map((field) => (
                <DropdownMenu.CheckboxItem
                  value={field.value === item.field}
                  key={field.value}
                  onSelect={() => {
                    actionActions.pathCondition(index, {
                      field: field.value as any,
                    })
                  }}
                >
                  <DropdownMenu.ItemTitle>{field.label}</DropdownMenu.ItemTitle>
                </DropdownMenu.CheckboxItem>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </GroupedInsetListBaseCell>

        <GroupedInsetListBaseCell className="flex flex-row justify-between">
          <Text className="text-label">Operator</Text>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <Text className="text-label">{currentOperator?.label || "Select"}</Text>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              {filterOperatorOptions
                .filter((operator) => operator.types.includes(currentField?.type ?? "text"))
                .map((operator) => (
                  <DropdownMenu.CheckboxItem
                    value={operator.value === item.operator}
                    key={operator.value}
                    onSelect={() => {
                      actionActions.pathCondition(index, {
                        operator: operator.value as any,
                      })
                    }}
                  >
                    <DropdownMenu.ItemTitle>{operator.label}</DropdownMenu.ItemTitle>
                  </DropdownMenu.CheckboxItem>
                ))}
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </GroupedInsetListBaseCell>

        <GroupedInsetListBaseCell className="flex flex-row justify-between">
          <Text className="text-label">Value</Text>
          {currentField?.type === "view" ? (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <View className="flex-row items-center gap-1">
                  {currentView?.icon({
                    height: 17,
                    width: 17,
                    color: currentView?.activeColor,
                  })}
                  <Text className="text-label">{currentView?.name || "Select"}</Text>
                </View>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                {views.map((field) => (
                  <DropdownMenu.CheckboxItem
                    value={String(field.view) === item.value}
                    key={String(field.view)}
                    onSelect={() => {
                      actionActions.pathCondition(index, {
                        value: String(field.view),
                      })
                    }}
                  >
                    <DropdownMenu.ItemTitle>{field.name}</DropdownMenu.ItemTitle>
                  </DropdownMenu.CheckboxItem>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Root>
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
    </>
  )
}
