import { Select } from "@/src/components/ui/form/Select"
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
      <Select
        options={translationOptions}
        value={currentTranslation?.value}
        onValueChange={(value) => {
          actionActions.patchRule(rule.index, { result: { translation: value } })
        }}
        wrapperClassName="min-w-40"
      />
    </GroupedInsetListCell>
  )
}
