import { Logo } from "@follow/components/icons/logo.jsx"
import { stopPropagation } from "@follow/utils/dom"
import { cn } from "@follow/utils/utils"

import { useFeedHeaderTitle } from "~/store/feed"

import { useEntryContentPlaceholderLogoShow } from "../atoms"

export const EntryPlaceholderLogo = () => {
  const title = useFeedHeaderTitle()

  const logoShow = useEntryContentPlaceholderLogoShow()

  return (
    <div
      onContextMenu={stopPropagation}
      className={cn(
        "flex w-full min-w-0 flex-col items-center justify-center gap-1 px-12 pb-6 text-center text-lg font-medium text-zinc-400 duration-500",
        !logoShow && "translate-y-[-50px] opacity-0",
      )}
    >
      <Logo className="size-16 opacity-40 grayscale" />
      <div className="line-clamp-3 w-[60ch] max-w-full">{title}</div>
    </div>
  )
}
