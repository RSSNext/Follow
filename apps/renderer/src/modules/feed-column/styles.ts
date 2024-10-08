import { IN_ELECTRON } from "@follow/shared/constants"
import clsx from "clsx"

export const feedColumnStyles = {
  item: clsx(
    !IN_ELECTRON && tw`duration-200 hover:bg-theme-item-hover`,
    tw`data-[active=true]:!bg-theme-item-active`,
  ),
}
