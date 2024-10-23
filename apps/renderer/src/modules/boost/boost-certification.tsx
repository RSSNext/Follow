import { useTranslation } from "react-i18next"

import { Tooltip, TooltipContent, TooltipPortal, TooltipTrigger } from "~/components/ui/tooltip"
import { cn } from "~/lib/utils"
import type { FeedOrListRespModel } from "~/models"

import { useBoostModal, useIsFeedBoosted } from "./hooks"

export const BoostCertification = ({
  feed,
  className,
}: {
  feed: FeedOrListRespModel
  className?: string
}) => {
  const showBoostModal = useBoostModal()
  const { t } = useTranslation()
  const isFeedBoosted = useIsFeedBoosted(feed.id)
  if (!isFeedBoosted) return null

  return (
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild>
        <i
          className={cn(
            "i-mgc-rocket-cute-fi ml-1.5 shrink-0 cursor-pointer text-amber-500 hover:bg-amber-400",
            className,
          )}
          onClick={(e) => {
            e.stopPropagation()
            showBoostModal(feed.id)
          }}
        />
      </TooltipTrigger>

      <TooltipPortal>
        <TooltipContent className="px-4 py-2">
          <div className="flex items-center text-base">
            <i className="i-mgc-rocket-cute-fi mr-2 shrink-0 text-amber-500" />
            {t("boost.feed_being_boosted")}
          </div>
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  )
}
