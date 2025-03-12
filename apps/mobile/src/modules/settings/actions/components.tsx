import { Text } from "react-native"
import * as DropdownMenu from "zeego/dropdown-menu"

import { GroupedInsetListCell } from "@/src/components/ui/grouped/GroupedList"
import { actionActions } from "@/src/store/action/store"
import type { ActionRule } from "@/src/store/action/types"

import { translationOptions } from "./constant"

export const ActionFormTranslation: React.FC<{ rule: ActionRule }> = ({ rule }) => {
  const currentTranslation = translationOptions.find(
    (translation) => translation.value === rule.result?.translation,
  )
  return (
    <GroupedInsetListCell
      label="Translate into"
      leftClassName="flex-none"
      rightClassName="flex-1 flex-row items-center gap-4 justify-end"
    >
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Text className="text-label">{currentTranslation?.label || "Select"}</Text>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          {translationOptions.map((translation) => (
            <DropdownMenu.CheckboxItem
              value={translation.value === currentTranslation?.value}
              key={translation.value}
              onSelect={() => {
                actionActions.patchRule(rule.index, { result: { translation: translation.value } })
              }}
            >
              <DropdownMenu.ItemTitle>{translation.label}</DropdownMenu.ItemTitle>
            </DropdownMenu.CheckboxItem>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </GroupedInsetListCell>
  )
}
