import { DotLottieReact } from "@lottiefiles/dotlottie-react"

import { stopPropagation } from "~/lib/dom"
import { cn } from "~/lib/utils"
import FollowAnimationUri from "~/lottie/follow.lottie?url"
import { useFeedHeaderTitle } from "~/store/feed"

import { useEntryContentPlaceholderLogoShow } from "../atoms"

const absoluteFollowAnimationUri = new URL(FollowAnimationUri, import.meta.url).href

export const EntryPlaceholderLogo = () => {
  const title = useFeedHeaderTitle()

  const logoShow = useEntryContentPlaceholderLogoShow()

  return (
    <div
      onContextMenu={stopPropagation}
      className={cn(
        "flex w-full min-w-0 flex-col items-center justify-center gap-1 text-balance px-12 pb-6 text-center text-lg font-medium text-zinc-400 duration-500",
        !logoShow && "translate-y-[-50px] opacity-0",
      )}
    >
      {/* <Logo className="size-16 opacity-40 grayscale" /> */}
      <div className="size-16 rounded-xl bg-accent grayscale">
        <DotLottieReact
          className="size-16"
          autoplay
          speed={2}
          height={64}
          width={64}
          src={absoluteFollowAnimationUri}
          loop={false}
        />
      </div>
      <span className="max-w-[60ch]">{title}</span>
    </div>
  )
}
