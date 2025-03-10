import { withOpacity } from "@follow/utils"
import { useMutation } from "@tanstack/react-query"
import { router } from "expo-router"
import { useCallback } from "react"
import type { ListRenderItem } from "react-native"
import { ActivityIndicator, Text, View } from "react-native"
import Animated, { LinearTransition } from "react-native-reanimated"
import { useColor } from "react-native-uikit-colors"

import { RotateableLoading } from "@/src/components/common/RotateableLoading"
import { SwipeableGroupProvider, SwipeableItem } from "@/src/components/common/SwipeableItem"
import { UINavigationHeaderActionButton } from "@/src/components/layouts/header/NavigationHeader"
import {
  NavigationBlurEffectHeader,
  SafeNavigationScrollView,
} from "@/src/components/layouts/views/SafeNavigationScrollView"
import {
  GroupedInformationCell,
  GroupedInsetListCard,
} from "@/src/components/ui/grouped/GroupedList"
import { ItemPressable } from "@/src/components/ui/pressable/ItemPressable"
import { Switch } from "@/src/components/ui/switch/Switch"
import { AddCuteReIcon } from "@/src/icons/add_cute_re"
import { CheckLineIcon } from "@/src/icons/check_line"
import { Magic2CuteFiIcon } from "@/src/icons/magic_2_cute_fi"
import {
  useActionRules,
  useIsActionDataDirty,
  usePrefetchActionRules,
} from "@/src/store/action/hooks"
import { actionActions, actionSyncService } from "@/src/store/action/store"
import type { ActionRule } from "@/src/store/action/types"

import { useSettingsNavigation } from "../hooks"

export const ActionsScreen = () => {
  const { isLoading } = usePrefetchActionRules()
  const rules = useActionRules()
  const isDirty = useIsActionDataDirty()

  return (
    <SafeNavigationScrollView nestedScrollEnabled className="bg-system-grouped-background">
      <NavigationBlurEffectHeader
        title="Actions"
        headerRight={useCallback(
          () => (
            <SaveRuleButton disabled={!isDirty} />
          ),
          [isDirty],
        )}
      />

      <View className="mt-6">
        <GroupedInsetListCard>
          <GroupedInformationCell
            title="Actions"
            description="Action are collections of rules that you can automate to perform tasks on server or client side."
            icon={<Magic2CuteFiIcon height={40} width={40} color="#fff" />}
            iconBackgroundColor="#059669"
          />
        </GroupedInsetListCard>
      </View>

      <View className="mt-6">
        <GroupedInsetListCard>
          {rules.length > 0 ? (
            <SwipeableGroupProvider>
              <Animated.FlatList
                keyExtractor={keyExtractor}
                itemLayoutAnimation={LinearTransition}
                scrollEnabled={false}
                data={rules}
                renderItem={ListItemCell}
                ItemSeparatorComponent={ItemSeparatorComponent}
              />
            </SwipeableGroupProvider>
          ) : isLoading && rules.length === 0 ? (
            <View className="mt-1">
              <ActivityIndicator />
            </View>
          ) : null}
        </GroupedInsetListCard>
        <NewRuleButton />
      </View>
    </SafeNavigationScrollView>
  )
}

const NewRuleButton = () => {
  const navigation = useSettingsNavigation()
  const label = useColor("label")
  return (
    <GroupedInsetListCard className="mt-6">
      <UINavigationHeaderActionButton
        onPress={() => navigation.navigate("ManageRule", { index: undefined })}
        className="flex-row items-center gap-3 py-4"
      >
        <AddCuteReIcon height={20} width={20} color={label} />
        <Text className="text-label text-lg">New Rule</Text>
      </UINavigationHeaderActionButton>
    </GroupedInsetListCard>
  )
}

const SaveRuleButton = ({ disabled }: { disabled?: boolean }) => {
  const mutation = useMutation({
    mutationFn: () => actionSyncService.saveRules(),
    onSuccess() {
      router.back()
    },
  })
  const label = useColor("label")
  return (
    <UINavigationHeaderActionButton
      onPress={mutation.mutate}
      disabled={disabled || mutation.isPending}
    >
      {mutation.isPending ? (
        <RotateableLoading size={20} color={withOpacity(label, 0.5)} />
      ) : (
        <CheckLineIcon height={20} width={20} color={disabled ? withOpacity(label, 0.5) : label} />
      )}
    </UINavigationHeaderActionButton>
  )
}

const ItemSeparatorComponent = () => {
  return (
    <View
      className="bg-opaque-separator ml-24 h-px flex-1"
      collapsable={false}
      style={{ transform: [{ scaleY: 0.5 }] }}
    />
  )
}

const keyExtractor = (item: ActionRule) => item.index.toString()
const ListItemCell: ListRenderItem<ActionRule> = (props) => {
  return <ListItemCellImpl {...props} />
}
const ListItemCellImpl: ListRenderItem<ActionRule> = ({ item: rule }) => {
  const navigation = useSettingsNavigation()
  return (
    <SwipeableItem
      swipeRightToCallAction
      rightActions={[
        {
          label: "Delete",
          onPress: () => {
            actionActions.deleteRule(rule.index)
          },
          backgroundColor: "red",
        },
        {
          label: "Edit",
          onPress: () => {
            navigation.navigate("ManageRule", { index: rule.index })
          },
          backgroundColor: "#0ea5e9",
        },
      ]}
    >
      <ItemPressable
        className="flex-row justify-between p-4"
        onPress={() => navigation.navigate("ManageRule", { index: rule.index })}
      >
        <Text className="text-label text-lg">{rule.name}</Text>
        <Switch
          size="sm"
          value={!rule.result.disabled}
          onValueChange={() => {
            actionActions.patchRule(rule.index, {
              result: {
                disabled: !rule.result.disabled,
              },
            })
          }}
        />
      </ItemPressable>
    </SwipeableItem>
  )
}
