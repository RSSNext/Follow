import type { FeedOrListRespModel } from "@follow/models/types"
import { cn } from "@follow/utils/utils"

import { useUISettingKey } from "~/atoms/settings/ui"
import { BoostCertification } from "~/modules/boost/boost-certification"
import { FeedCertification } from "~/modules/feed/feed-certification"
import { getPreferredTitle } from "~/store/feed/store"

export const FeedTitle = ({
  feed,
  className,
  title,
}: {
  feed: FeedOrListRespModel | null
  className?: string
  title?: string | null
}) => {
  const hideExtraBadge = useUISettingKey("hideExtraBadge")

  if (!feed) return null

  return (
    <div className={cn("flex items-center truncate", className)}>
      <div className="truncate">{title || getPreferredTitle(feed)}</div>
      {!hideExtraBadge && (
        <>
          <FeedCertification feed={feed} />
          <BoostCertification feed={feed} />
        </>
      )}
    </div>
  )
}
