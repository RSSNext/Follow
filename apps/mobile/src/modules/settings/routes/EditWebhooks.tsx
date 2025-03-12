import type { RouteProp } from "@react-navigation/native"
import { Text } from "react-native"

import { ModalHeader } from "@/src/components/layouts/header/ModalHeader"
import { SafeModalScrollView } from "@/src/components/layouts/views/SafeModalScrollView"
import { PlainTextField } from "@/src/components/ui/form/TextField"
import {
  GroupedInsetButtonCell,
  GroupedInsetListBaseCell,
  GroupedInsetListCard,
  GroupedInsetListSectionHeader,
} from "@/src/components/ui/grouped/GroupedList"
import { useActionRule } from "@/src/store/action/hooks"
import { actionActions } from "@/src/store/action/store"

import type { SettingsStackParamList } from "../types"

export const EditWebhooksScreen = ({
  route,
}: {
  route: RouteProp<SettingsStackParamList, "EditWebhooks">
}) => {
  const { index } = route.params
  const rule = useActionRule(index)

  return (
    <SafeModalScrollView className="bg-system-grouped-background">
      <ModalHeader headerTitle="Edit Webhooks" />
      <GroupedInsetListSectionHeader label="Webhooks" />
      <GroupedInsetListCard>
        {rule?.result.webhooks?.map((webhook, webhookIndex) => (
          <GroupedInsetListBaseCell className="flex-row" key={webhookIndex}>
            <PlainTextField
              placeholder="https://"
              inputMode="url"
              value={webhook}
              onChangeText={(value) => {
                actionActions.updateWebhook(index, webhookIndex, value)
              }}
            />
          </GroupedInsetListBaseCell>
        ))}
        <GroupedInsetButtonCell
          label="Add"
          onPress={() => {
            actionActions.addWebhook(index)
          }}
        />
      </GroupedInsetListCard>
      {__DEV__ && <Text>{JSON.stringify(rule?.result.webhooks, null, 2)}</Text>}
    </SafeModalScrollView>
  )
}
