import { useTranslation } from "react-i18next"

import { FollowSummary } from "~/components/feed-summary"
import { Logo } from "~/components/icons/logo"
import { Button } from "~/components/ui/button"
import { Card, CardHeader } from "~/components/ui/card"
import { LoadingCircle } from "~/components/ui/loading"
import { getFetchErrorMessage } from "~/lib/error-parser"
import { getNewIssueUrl } from "~/lib/issues"
import { cn } from "~/lib/utils"
import type { InboxModel } from "~/models"
import { useInbox } from "~/queries/inboxes"
import { useInboxById } from "~/store/inbox"

import { DiscoverEmail } from "./email-form"

export const InboxForm: Component<{
  id: string
  asWidget?: boolean
  onSuccess?: () => void
}> = ({ id: _id, asWidget, onSuccess }) => {
  const queryParams = { id: _id }

  const feedQuery = useInbox(queryParams)

  const id = feedQuery.data?.id || _id
  const inbox = useInboxById(id)

  const isSubscribed = true

  const { t } = useTranslation()

  return (
    <div
      className={cn(
        "flex h-full flex-col",
        asWidget ? "min-h-[320px] w-[550px] max-w-full" : "px-[18px] pb-[18px] pt-12",
      )}
    >
      {!asWidget && (
        <div className="mb-4 mt-2 flex items-center gap-2 text-[22px] font-bold">
          <Logo className="size-8" />
          {isSubscribed ? t("feed_form.update_follow") : t("feed_form.add_follow")}
        </div>
      )}

      {inbox ? (
        <InboxInnerForm
          {...{
            id,
            asWidget,
            onSuccess,
            inbox,
          }}
        />
      ) : feedQuery.isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <LoadingCircle size="large" />
        </div>
      ) : feedQuery.error ? (
        <div className="center grow flex-col gap-3">
          <i className="i-mgc-close-cute-re size-7 text-red-500" />
          <p>{t("feed_form.error_fetching_feed")}</p>
          <p className="cursor-text select-text break-all px-8 text-center">
            {getFetchErrorMessage(feedQuery.error)}
          </p>

          <div className="flex items-center gap-4">
            <Button
              variant="text"
              onClick={() => {
                feedQuery.refetch()
              }}
            >
              {t("feed_form.retry")}
            </Button>

            <Button
              variant="primary"
              onClick={() => {
                window.open(
                  getNewIssueUrl({
                    body: [
                      "### Info:",
                      "",
                      "List ID:",
                      "```",
                      id,
                      "```",
                      "",
                      "Error:",
                      "```",
                      getFetchErrorMessage(feedQuery.error),
                      "```",
                    ].join("\n"),
                    title: `Error in fetching list: ${id}`,
                  }),
                  "_blank",
                )
              }}
            >
              {t("feed_form.feedback")}
            </Button>
          </div>
        </div>
      ) : (
        <div className="center h-full grow flex-col">
          <i className="i-mgc-question-cute-re mb-6 size-12 text-zinc-500" />
          <p>{t("feed_form.feed_not_found")}</p>
          <p>{id}</p>
        </div>
      )}
    </div>
  )
}

const InboxInnerForm = ({ onSuccess, inbox }: { onSuccess?: () => void; inbox: InboxModel }) => {
  return (
    <div className="flex flex-1 flex-col gap-y-4">
      <Card>
        <CardHeader>
          <FollowSummary feed={inbox} />
        </CardHeader>
      </Card>
      <DiscoverEmail fullWidth onSuccess={onSuccess} />
    </div>
  )
}
