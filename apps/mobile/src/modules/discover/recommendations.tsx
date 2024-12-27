import { RSSHubCategories } from "@follow/constants"
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"
import { useHeaderHeight } from "@react-navigation/elements"
import { ScrollView, Text } from "react-native"

import type { TabComponent } from "@/src/components/ui/tabview"
import { TabView } from "@/src/components/ui/tabview"

export const Recommendations = () => {
  const headerHeight = useHeaderHeight()
  const tabHeight = useBottomTabBarHeight()

  return (
    <TabView
      lazyOnce
      lazyTab
      Tab={Tab}
      tabbarStyle={{ paddingTop: headerHeight }}
      scrollerContainerStyle={{ paddingBottom: tabHeight }}
      tabs={RSSHubCategories.map((category) => ({ name: category, value: category }))}
    />
  )
}

const Tab: TabComponent = ({ tab }) => {
  return (
    <ScrollView>
      <Text>{tab.name}</Text>
    </ScrollView>
  )
}
