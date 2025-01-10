import { useAtomValue } from "jotai"
import { Text } from "react-native"

import { useSearchPageContext } from "../ctx"
import { BaseSearchPageScrollView } from "./__base"

export const SearchList = () => {
  const { searchValueAtom } = useSearchPageContext()
  const searchValue = useAtomValue(searchValueAtom)

  return (
    <BaseSearchPageScrollView>
      <Text className="text-text">{searchValue}</Text>
    </BaseSearchPageScrollView>
  )
}
