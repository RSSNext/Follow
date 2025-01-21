import { View } from "react-native"

import { setUISetting, useUISettingKey } from "@/src/atoms/settings/ui"
import {
  NavigationBlurEffectHeader,
  SafeNavigationScrollView,
} from "@/src/components/common/SafeNavigationScrollView"
import { Select } from "@/src/components/ui/form/Select"
import {
  GroupedInsetListCard,
  GroupedInsetListCell,
  GroupedInsetListSectionHeader,
} from "@/src/components/ui/grouped/GroupedList"
import { Switch } from "@/src/components/ui/switch/Switch"

export const AppearanceScreen = () => {
  const showUnreadCount = useUISettingKey("subscriptionShowUnreadCount")
  const hideExtraBadge = useUISettingKey("hideExtraBadge")
  const thumbnailRatio = useUISettingKey("thumbnailRatio")

  return (
    <SafeNavigationScrollView className="bg-system-grouped-background">
      <NavigationBlurEffectHeader title="Appearance" />
      <View className="mt-6">
        <GroupedInsetListSectionHeader label="Subscription" />
        <GroupedInsetListCard>
          <GroupedInsetListCell
            label="Show unread count"
            description="Show unread count in the subscription list"
          >
            <Switch
              size="sm"
              value={showUnreadCount}
              onValueChange={(val) => {
                setUISetting("subscriptionShowUnreadCount", val)
              }}
            />
          </GroupedInsetListCell>

          <GroupedInsetListCell
            label="Hide special badge"
            description="Hide the special badge of the feed in the sidebar, e.g. Boost, Claimed"
          >
            <Switch
              size="sm"
              value={hideExtraBadge}
              onValueChange={(val) => {
                setUISetting("hideExtraBadge", val)
              }}
            />
          </GroupedInsetListCell>
          <GroupedInsetListCell
            label="Thumbnail ratio"
            description="The ratio of the thumbnail in the entry list."
          >
            <View className="w-[100px]">
              <Select
                options={[
                  { label: "Square", value: "square" },
                  { label: "Original", value: "original" },
                ]}
                value={thumbnailRatio}
                onValueChange={(val) => {
                  setUISetting("thumbnailRatio", val as "square" | "original")
                }}
              />
            </View>
          </GroupedInsetListCell>
        </GroupedInsetListCard>
      </View>
    </SafeNavigationScrollView>
  )
}
