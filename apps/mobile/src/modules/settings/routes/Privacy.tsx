import { ScrollView } from "react-native"

import { GroupedInsetListCard, GroupedInsetListItem } from "@/src/components/ui/grouped/GroupedList"

export const PrivacyScreen = () => {
  return (
    <ScrollView>
      <GroupedInsetListCard>
        <GroupedInsetListItem />
      </GroupedInsetListCard>
    </ScrollView>
  )
}
