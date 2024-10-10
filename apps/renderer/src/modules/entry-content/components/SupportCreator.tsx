import { useTranslation } from "react-i18next"

import { Button } from "~/components/ui/button"
import { Divider } from "~/components/ui/divider"
import { UserAvatar } from "~/modules/user/UserAvatar"
import { useEntry } from "~/store/entry"
import { useFeedById } from "~/store/feed"

import { useTipModal } from "../../wallet/hooks"

export const SupportCreator = ({ entryId }: { entryId: string }) => {
  const { t } = useTranslation()
  const entry = useEntry(entryId)
  const feed = useFeedById(entry?.feedId)

  const openTipModal = useTipModal({
    userId: feed?.ownerUserId ?? undefined,
    feedId: entry?.feedId,
    entryId,
  })

  if (!feed || !feed.ownerUserId || feed.type !== "feed") return null

  return (
    <>
      <Divider />

      <div className="my-16 flex flex-col items-center gap-8">
        <UserAvatar
          className="w-40 flex-col gap-3 p-0"
          avatarClassName="size-12"
          userId={feed.ownerUserId}
          enableModal
        />
        <Button className="text-base" onClick={() => openTipModal()}>
          <i className="i-mgc-power-outline mr-1.5 text-lg" />
          {t("entry_content.support_creator")}
        </Button>
        {!!feed.tipUsers?.length && (
          <>
            <div className="text-sm text-zinc-500">
              {t("entry_content.support_amount", { amount: feed.tipUsers.length })}
            </div>
            <div className="flex w-fit max-w-80 flex-wrap gap-4">
              {feed.tipUsers?.map((user) => (
                <div key={user.id} className="size-8">
                  <UserAvatar
                    className="h-auto p-0"
                    avatarClassName="size-8"
                    userId={user?.id}
                    enableModal={true}
                    hideName={true}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  )
}
