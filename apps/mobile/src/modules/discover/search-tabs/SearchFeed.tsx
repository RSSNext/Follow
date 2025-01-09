import { useQuery } from "@tanstack/react-query"
import { useAtomValue } from "jotai"
import { memo } from "react"
import { Text } from "react-native"

import { LoadingIndicator } from "@/src/components/ui/loading"
import { apiClient } from "@/src/lib/api-fetch"

import { useSearchPageContext } from "../ctx"
import { BaseSearchPageFlatList, BaseSearchPageRootView, BaseSearchPageScrollView } from "./__base"

type SearchResultItem = Awaited<ReturnType<typeof apiClient.discover.$post>>["data"][number]

export const SearchFeed = () => {
  const { searchValueAtom } = useSearchPageContext()
  const searchValue = useAtomValue(searchValueAtom)

  const { data, isLoading } = useQuery({
    queryKey: ["searchFeed", searchValue],
    queryFn: () => {
      return apiClient.discover.$post({
        json: {
          keyword: searchValue,
          target: "feeds",
        },
      })
    },
    enabled: !!searchValue,
  })

  if (isLoading) {
    return (
      <BaseSearchPageRootView>
        <LoadingIndicator color="#fff" size={32} />
      </BaseSearchPageRootView>
    )
  }

  return (
    <BaseSearchPageFlatList
      keyExtractor={keyExtractor}
      renderScrollComponent={(props) => <BaseSearchPageScrollView {...props} />}
      data={data?.data}
      renderItem={renderItem}
    />
  )
}
const keyExtractor = (item: SearchResultItem) => item.feed?.id ?? Math.random().toString()

const renderItem = ({ item }: { item: SearchResultItem }) => (
  <SearchFeedItem key={item.feed?.id} item={item} />
)

const SearchFeedItem = memo(({ item }: { item: SearchResultItem }) => {
  return <Text className="text-text">{item.feed?.title}</Text>
})
