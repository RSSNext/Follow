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

  if (!source) {
    return null
  }

  return (
    <div>
      {isHTML ? (
        <>
          <HTML as="div" className={cn("prose align-middle dark:prose-invert", className)} noMedia>
            {source}
          </HTML>
          {nextTarget && (
            <>
              <i className="i-mgc-translate-2-cute-re mb-1 mt-4 align-middle" />
              <HTML
                as="div"
                className={cn("prose align-middle dark:prose-invert", className)}
                noMedia
              >
                {nextTarget}
              </HTML>
            </>
          )}
        </>
      ) : (
        <>
          <div className={cn("inline align-middle", className)}>
            <span className="align-middle">{source}</span>
            {nextTarget && (
              <>
                <i className="i-mgc-translate-2-cute-re ml-2 mr-0.5 align-middle" />
                <span className="align-middle">{nextTarget}</span>
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
}
