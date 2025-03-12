import type { RouteProp } from "@react-navigation/native"
import { Fragment } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { useColor } from "react-native-uikit-colors"
import * as DropdownMenu from "zeego/dropdown-menu"

import { SwipeableItem } from "@/src/components/common/SwipeableItem"
import {
  NavigationBlurEffectHeader,
  SafeNavigationScrollView,
} from "@/src/components/layouts/views/SafeNavigationScrollView"
import { PlainTextField } from "@/src/components/ui/form/TextField"
import {
  GroupedInsetListActionCell,
  GroupedInsetListActionCellRadio,
  GroupedInsetListCard,
  GroupedInsetListCell,
  GroupedInsetListSectionHeader,
  GroupedPlainButtonCell,
} from "@/src/components/ui/grouped/GroupedList"
import { views } from "@/src/constants/views"
import { CloseCircleFillIcon } from "@/src/icons/close_circle_fill"
import { useActionRule } from "@/src/store/action/hooks"
import { actionActions } from "@/src/store/action/store"
import type { ActionFilter, ActionRule } from "@/src/store/action/types"
import { accentColor } from "@/src/theme/colors"

import { availableActionList, filterFieldOptions, filterOperatorOptions } from "../actions"
import { useSettingsNavigation } from "../hooks"
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
      <NavigationBlurEffectHeader title={`Edit Rule - ${rule?.name}`} />
      <RuleImpl index={index} />
    </SafeNavigationScrollView>
  )
}

const RuleImpl: React.FC<{ index: number }> = ({ index }) => {
  const rule = useActionRule(index)

  if (!rule) {
    return <Text>No rule available</Text>
  }

  return (
    <View className="gap-6">
      <NameSection rule={rule} />
      <FilterSection rule={rule} />
      <ConditionSection filter={rule.condition as any} index={rule.index} />
      <ActionSection rule={rule} />
      {__DEV__ && (
        <View className="mx-6">
          <Text className="text-label">{JSON.stringify(rule, null, 2)}</Text>
        </View>
      )}
    </View>
  )
}

const NameSection: React.FC<{ rule: ActionRule }> = ({ rule }) => {
  return (
    <GroupedInsetListCard>
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
    </GroupedInsetListCard>
  )
}

const FilterSection: React.FC<{ rule: ActionRule }> = ({ rule }) => {
  const hasCustomFilters = rule.condition.length > 0
  return (
    <View>
      <GroupedInsetListSectionHeader label="When feeds match..." />
      <GroupedInsetListCard>
        <GroupedInsetListActionCellRadio
          label="All"
          selected={!hasCustomFilters}
          onPress={() => {
            actionActions.toggleRuleFilter(rule.index)
          }}
        />
        <GroupedInsetListActionCellRadio
          label="Custom filters"
          selected={hasCustomFilters}
          onPress={() => {
            actionActions.toggleRuleFilter(rule.index)
          }}
        />
      </GroupedInsetListCard>
    </View>
  )
}

const ConditionSection: React.FC<{ filter: ActionFilter; index: number }> = ({ filter, index }) => {
  const navigation = useSettingsNavigation()

  if (filter.length === 0) return null
  return (
    <View>
      <GroupedInsetListSectionHeader label="Conditions" />
      <GroupedInsetListCard>
        {filter.map((group, groupIndex) => {
          return (
            <Fragment key={groupIndex}>
              {group.map((item, itemIndex) => {
                const currentField = filterFieldOptions.find((field) => field.value === item.field)
                const currentOperator = filterOperatorOptions.find(
                  (field) => field.value === item.operator,
                )
                const currentValue =
                  currentField?.type === "view"
                    ? views.find((view) => view.view === Number(item.value))?.name
                    : item.value
                return (
                  <Fragment
                    key={`${groupIndex}-${itemIndex}-${item.field}-${item.operator}-${item.value}`}
                  >
                    <SwipeableItem
                      swipeRightToCallAction
                      rightActions={[
                        {
                          label: "Delete",
                          onPress: () => {
                            actionActions.deleteConditionItem({
                              ruleIndex: index,
                              groupIndex,
                              conditionIndex: itemIndex,
                            })
                          },
                          backgroundColor: "red",
                        },
                        {
                          label: "Edit",
                          onPress: () => {
                            navigation.navigate("ManageCondition", {
                              ruleIndex: index,
                              groupIndex,
                              conditionIndex: itemIndex,
                            })
                          },
                          backgroundColor: "#0ea5e9",
                        },
                      ]}
                    >
                      <GroupedInsetListActionCell
                        label={
                          [currentField?.label, currentOperator?.label, currentValue]
                            .filter(Boolean)
                            .join(" ") || "Unknown"
                        }
                        onPress={() => {
                          navigation.navigate("ManageCondition", {
                            ruleIndex: index,
                            groupIndex,
                            conditionIndex: itemIndex,
                          })
                        }}
                      />
                    </SwipeableItem>
                    {itemIndex === group.length - 1 && (
                      <GroupedPlainButtonCell
                        label="And"
                        textClassName="text-left"
                        onPress={() => {
                          actionActions.addConditionItem({ ruleIndex: index, groupIndex })
                          setTimeout(() => {
                            navigation.navigate("ManageCondition", {
                              ruleIndex: index,
                              groupIndex,
                              conditionIndex: group.length,
                            })
                          }, 0)
                        }}
                      />
                    )}
                  </Fragment>
                )
              })}
            </Fragment>
          )
        })}
        <GroupedPlainButtonCell
          label="Or"
          onPress={() => {
            actionActions.addConditionGroup({ ruleIndex: index })
          }}
        />
      </GroupedInsetListCard>
    </View>
  )
}

const ActionSection: React.FC<{ rule: ActionRule }> = ({ rule }) => {
  const secondaryLabelColor = useColor("secondaryLabel")
  const enabledActions = availableActionList.filter(
    (action) => rule.result[action.value] !== undefined,
  )
  const notEnabledActions = availableActionList.filter(
    (action) => rule.result[action.value] === undefined,
  )

  return (
    <View>
      <GroupedInsetListSectionHeader label="Then do..." />
      <GroupedInsetListCard>
        {enabledActions.map((action) =>
          action.component ? (
            <action.component key={action.value} rule={rule} />
          ) : (
            <GroupedInsetListCell
              label={action.label}
              key={action.value}
              leftClassName="flex-none"
              rightClassName="flex-1 flex-row justify-end"
            >
              <TouchableOpacity
                onPress={() => {
                  actionActions.deleteRuleAction(rule.index, action.value)
                }}
              >
                <CloseCircleFillIcon height={16} width={16} color={secondaryLabelColor} />
              </TouchableOpacity>
            </GroupedInsetListCell>
          ),
        )}
        {notEnabledActions.length > 0 && (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <GroupedPlainButtonCell label="Add" />
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              {notEnabledActions.map((action) => (
                <DropdownMenu.Item
                  key={action.value}
                  onSelect={() => {
                    if (action.onEnable) {
                      action.onEnable(rule.index)
                    } else {
                      actionActions.patchRule(rule.index, { result: { [action.value]: true } })
                    }
                  }}
                >
                  <DropdownMenu.ItemTitle>{action.label}</DropdownMenu.ItemTitle>
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        )}
      </GroupedInsetListCard>
    </View>
  )
}
