import { useAtom } from "jotai"
import { View } from "react-native"

import { TabBar } from "@/src/components/ui/tabview/TabBar"
import type { Tab } from "@/src/components/ui/tabview/types"

import { SearchType } from "./constants"
import { useDiscoverPageContext } from "./ctx"

const Tabs: Tab[] = [
  { name: "Feed", value: SearchType.Feed },
  { name: "List", value: SearchType.List },
  { name: "User", value: SearchType.User },
  { name: "RSSHub", value: SearchType.RSSHub },
]
export const SearchTabBar = () => {
  const { searchTypeAtom } = useDiscoverPageContext()
  const [searchType, setSearchType] = useAtom(searchTypeAtom)

  return (
    <View>
      <TabBar
        tabs={Tabs}
        currentTab={Tabs.findIndex((tab) => tab.value === searchType)}
        onTabItemPress={(index) => {
          setSearchType(Tabs[index].value as SearchType)
        }}
      />
    </View>
  )
}
