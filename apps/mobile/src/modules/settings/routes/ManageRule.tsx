import type { RouteProp } from "@react-navigation/native"
import { Text, TouchableOpacity, View } from "react-native"
import { useColor } from "react-native-uikit-colors"
import * as DropdownMenu from "zeego/dropdown-menu"

import {
  NavigationBlurEffectHeader,
  SafeNavigationScrollView,
} from "@/src/components/layouts/views/SafeNavigationScrollView"
import { PlainTextField } from "@/src/components/ui/form/TextField"
import {
  GroupedInsetListActionCellRadio,
  GroupedInsetListCard,
  GroupedInsetListCell,
  GroupedInsetListSectionHeader,
  GroupedPlainButtonCell,
} from "@/src/components/ui/grouped/GroupedList"
import { CloseCircleFillIcon } from "@/src/icons/close_circle_fill"
import { useActionRule } from "@/src/store/action/hooks"
import { actionActions } from "@/src/store/action/store"
import type { ActionId, ActionRule } from "@/src/store/action/types"
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
    <View className="gap-6">
      {rule ? <NameSection rule={rule} /> : <Text>No rule available</Text>}
      {rule ? <FilterSection rule={rule} /> : <Text>No rule available</Text>}
      {rule ? <ActionSection rule={rule} /> : <Text>No rule available</Text>}
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

const ActionSection: React.FC<{ rule: ActionRule }> = ({ rule }) => {
  const secondaryLabelColor = useColor("secondaryLabel")
  const enabledActions = actionList.filter((action) => rule.result[action.id] !== undefined)
  const notEnabledActions = actionList.filter((action) => rule.result[action.id] === undefined)

  return (
    <View>
      <GroupedInsetListSectionHeader label="Then do..." />
      <GroupedInsetListCard>
        {enabledActions.map((action) =>
          action.component ? (
            <action.component key={action.id} rule={rule} />
          ) : (
            <GroupedInsetListCell
              label={action.label}
              key={action.id}
              leftClassName="flex-none"
              rightClassName="flex-1 flex-row justify-end"
            >
              <TouchableOpacity
                onPress={() => {
                  actionActions.deleteRuleAction(rule.index, action.id)
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
                  key={action.id}
                  onSelect={() => {
                    if (action.onEnable) {
                      action.onEnable(rule.index)
                    } else {
                      actionActions.patchRule(rule.index, { result: { [action.id]: true } })
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

const actionList: Array<{
  id: ActionId
  label: string
  onEnable?: (index: number) => void
  component?: React.FC<{ rule: ActionRule }>
}> = [
  {
    id: "summary",
    label: "Generate summary using AI",
  },
  {
    id: "translation",
    label: "Translate into",
    onEnable: (index) => {
      actionActions.patchRule(index, { result: { translation: "zh-CN" } })
    },
  },
  {
    id: "readability",
    label: "Enable readability",
  },
  {
    id: "sourceContent",
    label: "View source content",
  },
  {
    id: "newEntryNotification",
    label: "Notification of new entry",
  },
  {
    id: "silence",
    label: "Silence",
  },
  {
    id: "block",
    label: "Block",
  },
  {
    id: "rewriteRules",
    label: "Rewrite Rules",
    onEnable: (index: number) => {
      actionActions.patchRule(index, { result: { rewriteRules: [] } })
    },
  },
  {
    id: "webhooks",
    label: "Webhooks",
    onEnable: (index) => {
      actionActions.patchRule(index, { result: { webhooks: [] } })
    },
  },
]
