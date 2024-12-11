import { useWhoami } from "@client/atoms/user"
import { Avatar, AvatarFallback, AvatarImage } from "@follow/components/ui/avatar/index.jsx"
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from "@follow/components/ui/tooltip/index.jsx"
import type { FeedOrListRespModel } from "@follow/models/types"
import { cn } from "@follow/utils"
import { useTranslation } from "react-i18next"

export const FeedCertification = ({
  feed,
  className,
}: {
  feed: FeedOrListRespModel
  className?: string
}) => {
  const me = useWhoami()

  const { t } = useTranslation()

  const { type } = feed

  return (
    feed.ownerUserId &&
    (feed.ownerUserId === me?.id ? (
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <i className={cn("i-mgc-certificate-cute-fi ml-1.5 shrink-0 text-accent", className)} />
        </TooltipTrigger>

        <TooltipPortal>
          <TooltipContent className="px-4 py-2">
            <div className="flex items-center text-base font-semibold">
              <i className="i-mgc-certificate-cute-fi mr-2 size-4 shrink-0 text-accent" />
              {type === "feed" ? t("feed_item.claimed_feed") : t("feed_item.claimed_list")}
            </div>
            <div>{t("feed_item.claimed_by_you")}</div>
          </TooltipContent>
        </TooltipPortal>
      </Tooltip>
    ) : (
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <i
            className={cn("i-mgc-certificate-cute-fi ml-1.5 shrink-0 text-amber-500", className)}
          />
        </TooltipTrigger>

        <TooltipPortal>
          <TooltipContent className="px-4 py-2">
            <div className="flex items-center text-base font-semibold">
              <i className="i-mgc-certificate-cute-fi mr-2 shrink-0 text-amber-500" />
              {type === "feed" ? t("feed_item.claimed_feed") : t("feed_item.claimed_list")}
            </div>
            <div className="mt-1 flex items-center gap-1.5">
              <span>{t("feed_item.claimed_by_owner")}</span>
              {feed.owner ? (
                <Avatar className="inline-flex aspect-square size-5 rounded-full">
                  <AvatarImage src={feed.owner.image || undefined} />
                  <AvatarFallback>{feed.owner.name?.slice(0, 2)}</AvatarFallback>
                </Avatar>
              ) : (
                <span>{t("feed_item.claimed_by_unknown")}</span>
              )}
            </div>
          </TooltipContent>
        </TooltipPortal>
      </Tooltip>
    ))
  )
}
