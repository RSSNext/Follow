import { RSSHubCategories } from "@follow/constants"
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"
import { useHeaderHeight } from "@react-navigation/elements"

import { TabView } from "@/src/components/ui/tabview"

export const Recommendations = () => {
  const headerHeight = useHeaderHeight()
  const tabHeight = useBottomTabBarHeight()
  return (
    <TabView
      tabbarStyle={{ paddingTop: headerHeight }}
      scrollerContainerStyle={{ paddingBottom: tabHeight }}
      tabs={RSSHubCategories.map((category) => ({ name: category, value: category }))}
    />
  )
}
