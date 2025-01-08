import { useAtom } from "jotai"
import { View } from "react-native"

import { TabBar } from "@/src/components/ui/tabview/TabBar"
import type { Tab } from "@/src/components/ui/tabview/types"

import { SearchType } from "./constants"
import { useDiscoverPageContext } from "./ctx"

const Tabs: Tab[] = [
  { name: "All", value: SearchType.AGGREGATE },
  { name: "RSS", value: SearchType.RSS },
  { name: "RSSHub", value: SearchType.RSSHUB },
  { name: "User", value: SearchType.USER },
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
