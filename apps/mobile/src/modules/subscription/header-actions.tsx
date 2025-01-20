import { TouchableOpacity } from "react-native"
import type { ContextMenuAction } from "react-native-context-menu-view"

import { DropdownMenu } from "@/src/components/ui/dropdown/DropdownMenu"
import { AZSortAscendingLettersCuteReIcon } from "@/src/icons/AZ_sort_ascending_letters_cute_re"
import { AZSortDescendingLettersCuteReIcon } from "@/src/icons/AZ_sort_descending_letters_cute_re"
import { Numbers90SortAscendingCuteReIcon } from "@/src/icons/numbers_90_sort_ascending_cute_re"
import { Numbers90SortDescendingCuteReIcon } from "@/src/icons/numbers_90_sort_descending_cute_re"
import { accentColor } from "@/src/theme/colors"

import {
  setFeedListSortMethod,
  setFeedListSortOrder,
  useFeedListSortMethod,
  useFeedListSortOrder,
} from "./atoms"

const map = {
  alphabet: {
    asc: AZSortAscendingLettersCuteReIcon,
    desc: AZSortDescendingLettersCuteReIcon,
  },
  count: {
    desc: Numbers90SortDescendingCuteReIcon,
    asc: Numbers90SortAscendingCuteReIcon,
  },
}

export const SortActionButton = () => {
  const sortMethod = useFeedListSortMethod()
  const sortOrder = useFeedListSortOrder()

  const orderActions: ContextMenuAction[] = [
    { title: "Ascending", selected: sortOrder === "asc" },
    { title: "Descending", selected: sortOrder === "desc" },
  ]

  const actions: ContextMenuAction[] = [
    { title: "Alphabet", actions: orderActions, selected: sortMethod === "alphabet" },
    { title: "Unread Count", actions: orderActions, selected: sortMethod === "count" },
  ]

  const Icon = map[sortMethod][sortOrder]
  return (
    <DropdownMenu
      options={actions}
      currentValue={sortMethod}
      handlePress={(e) => {
        const [firstArgs, secondary] = e.nativeEvent.indexPath

        switch (firstArgs) {
          case 0: {
            setFeedListSortMethod("alphabet")
            break
          }
          case 1: {
            setFeedListSortMethod("count")
            break
          }
        }

        switch (secondary) {
          case 0: {
            setFeedListSortOrder("asc")
            break
          }
          case 1: {
            setFeedListSortOrder("desc")
            break
          }
        }
      }}
    >
      <TouchableOpacity className="size-6 rounded-full">
        <Icon color={accentColor} />
      </TouchableOpacity>
    </DropdownMenu>
  )
}
