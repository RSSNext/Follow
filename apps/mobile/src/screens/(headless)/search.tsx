import { Stack } from "expo-router"
import { ScrollView, Text, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import {
  DiscoverPageContext,
  DiscoverPageProvider,
  SearchBarHeightProvider,
  useDiscoverPageContext,
  useSearchBarHeight,
  useSetSearchBarHeight,
} from "@/src/modules/discover/ctx"
import { SearchHeader } from "@/src/modules/discover/search"

const Search = () => {
  return (
    <View className="flex-1">
      <DiscoverPageProvider>
        <SearchBarHeightProvider>
          <SearchbarMount />
          <Content />
        </SearchBarHeightProvider>
      </DiscoverPageProvider>
    </View>
  )
}

const Content = () => {
  const searchBarHeight = useSearchBarHeight()
  const insets = useSafeAreaInsets()
  return (
    <ScrollView
      style={{ paddingTop: searchBarHeight - insets.top }}
      automaticallyAdjustContentInsets
      contentInsetAdjustmentBehavior="always"
      className="flex-1"
    >
      <Text className="text-text">Search</Text>
      <Text className="text-text">Search</Text>
      <Text className="text-text">Search</Text>
      <Text className="text-text">Search</Text>
      <Text className="text-text">Search</Text>
      <Text className="text-text">Search</Text>
      <Text className="text-text">Search</Text>
      <Text className="text-text">Search</Text>
      <Text className="text-text">Search</Text>
      <Text className="text-text">Search</Text>
      <Text className="text-text">Search</Text>
      <Text className="text-text">Search</Text>
      <Text className="text-text">Search</Text>
      <Text className="text-text">Search</Text>
    </ScrollView>
  )
}
const SearchbarMount = () => {
  const ctx = useDiscoverPageContext()
  const setSearchBarHeight = useSetSearchBarHeight()

  return (
    <Stack.Screen
      options={{
        headerShown: true,
        headerTransparent: true,

        header: () => {
          return (
            <DiscoverPageContext.Provider value={ctx}>
              <SearchHeader onLayout={(e) => setSearchBarHeight(e.nativeEvent.layout.height)} />
            </DiscoverPageContext.Provider>
          )
        },
      }}
    />
  )
}

export default Search
