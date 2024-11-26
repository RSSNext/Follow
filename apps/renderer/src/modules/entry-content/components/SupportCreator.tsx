import { Button } from "@follow/components/ui/button/index.js"
import { Divider } from "@follow/components/ui/divider/index.js"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"

import { useWhoami } from "~/atoms/user"
import { useBoostModal } from "~/modules/boost/hooks"
import { useFeedBoostersQuery } from "~/modules/boost/query"
import { FeedIcon } from "~/modules/feed/feed-icon"
import { UserAvatar } from "~/modules/user/UserAvatar"
import { deduplicateUsers } from "~/modules/user/utils"
import { useEntry } from "~/store/entry"
import { useFeedById } from "~/store/feed"

import { UserGallery } from "../../user/UserGallery"
import { useTipModal } from "../../wallet/hooks"

export const SupportCreator = ({ entryId }: { entryId: string }) => {
  const { t } = useTranslation()
  const entry = useEntry(entryId)
  const feed = useFeedById(entry?.feedId)
  const { data: feedBoosters } = useFeedBoostersQuery(entry?.feedId)

  const openTipModal = useTipModal()
  const openBoostModal = useBoostModal()

  const isMyOwnedFeed = feed?.ownerUserId === useWhoami()?.id
  const allSupporters = useMemo(
    () =>
      deduplicateUsers([
        ...(feed && "tipUsers" in feed && feed.tipUsers ? feed.tipUsers : []),
        ...(feedBoosters ?? []),
      ]),
    [feed, feedBoosters],
  )
  const supportAmount = allSupporters.length

  if (!feed || feed.type !== "feed") return null

  return (
    <>
      <Divider data-hide-in-print />

      <div className="my-16 flex flex-col items-center gap-8" data-hide-in-print>
        {feed.ownerUserId ? (
          <UserAvatar
            className="w-40 flex-col gap-3 p-0"
            avatarClassName="size-12"
            userId={feed.ownerUserId}
            enableModal
          />
        ) : (
          <FeedIcon noMargin className="w-40 flex-col gap-3 p-0" size={46} feed={feed} fallback />
        )}
        <span className="-mt-6 text-lg font-medium">{feed.title}</span>

        <div className="flex items-center gap-4">
          {!isMyOwnedFeed && (
            <Button
              onClick={() =>
                openTipModal({
                  userId: feed.ownerUserId ?? undefined,
                  feedId: entry?.feedId,
                  entryId,
                })
              }
            >
              <i className="i-mgc-power-outline mr-1.5 text-lg" />
              {t("entry_content.support_creator")}
            </Button>
          )}
          <Button
            variant={!isMyOwnedFeed ? "outline" : "primary"}
            onClick={() => openBoostModal(feed.id)}
          >
            <i className="i-mgc-rocket-cute-fi mr-1.5 text-lg" />
            {t("boost.boost_feed")}
          </Button>
        </div>

        {supportAmount > 0 && (
          <>
            <div className="text-sm text-zinc-500">
              {t("entry_content.support_amount", { amount: supportAmount })}
            </div>
            <UserGallery users={allSupporters} />
          </>
        )}
      </div>
    </>
  )
}
