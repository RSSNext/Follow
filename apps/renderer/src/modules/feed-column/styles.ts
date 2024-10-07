import clsx from "clsx"

export const feedColumnStyles = {
  item: clsx(
    !window.electron && tw`duration-200 hover:bg-theme-item-hover`,
    tw`data-[active=true]:!bg-theme-item-active`,
  ),
}
