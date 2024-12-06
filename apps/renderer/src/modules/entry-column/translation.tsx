import { cn } from "@follow/utils/utils"
import { useMemo } from "react"

import { HTML } from "~/components/ui/markdown/HTML"

export const EntryTranslation: Component<{
  source?: string | null
  target?: string
  showTranslation?: boolean
  isHTML?: boolean
}> = ({ source, target, showTranslation = true, className, isHTML }) => {
  const nextTarget = useMemo(() => {
    if (!target || !showTranslation || source === target) {
      return ""
    }
    return target
  }, [source, target, showTranslation])

  const content = useMemo(() => source + (nextTarget ? ` ${nextTarget}` : ""), [source, nextTarget])

  if (!source) {
    return null
  }

  return (
    <div>
      {nextTarget && <i className="i-mgc-translate-2-cute-re mr-1 align-middle" />}
      {isHTML ? (
        <HTML
          as="div"
          className={cn("prose inline align-middle dark:prose-invert", className)}
          noMedia
        >
          {content}
        </HTML>
      ) : (
        <div className={cn("inline align-middle", className)}>{content}</div>
      )}
    </div>
  )
}
