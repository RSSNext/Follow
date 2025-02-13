import { env } from "@follow/shared/env"
import { useTranslation } from "react-i18next"

import { CopyButton } from "~/components/ui/button/CopyButton"
import { useInboxById } from "~/store/inbox"
import { useFeedUnreadStore } from "~/store/unread"

import { UnreadNumber } from "./UnreadNumber"

export const InboxList = ({ id }: { id: string }) => {
  const { t } = useTranslation()
  const inboxUnread = useFeedUnreadStore((state) => state.data[id] || 0)
  const inbox = useInboxById(id)

  return (
    <div>
      <div className="mx-3 mb-1 flex items-center justify-between px-2.5 py-1">
        <div className="text-base font-bold">{inbox?.title || t("words.inbox")}</div>
        <div className="ml-2 flex items-center gap-3 text-base text-zinc-400 dark:text-zinc-600 lg:text-sm lg:!text-theme-vibrancyFg">
          <UnreadNumber unread={inboxUnread} className="text-xs !text-inherit" />
        </div>
      </div>
      <div className="px-3">
        <div className="mb-4 px-2.5 text-sm text-zinc-500">
          <span>{t("discover.inbox.description")}</span>
          <a
            href="https://github.com/RSSNext/Follow/wiki/Inbox#webhooks"
            className="ml-2 inline text-zinc-600 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("discover.inbox.webhooks_docs")}
          </a>
        </div>
        <div className="mb-4 px-2.5 text-sm">
          <div className="text-zinc-500">{t("discover.inbox.handle")}</div>
          <div>{id}</div>
        </div>
        <div className="px-2.5 text-sm">
          <div className="text-zinc-500">{t("discover.inbox.email")}</div>
          <div className="group relative flex w-fit items-center gap-2">
            <span className="shrink-0">
              {id}
              {env.VITE_INBOXES_EMAIL}
            </span>
            <CopyButton
              value={`${id}${env.VITE_INBOXES_EMAIL}`}
              className="p-1 lg:absolute lg:-right-6 lg:opacity-0 lg:group-hover:opacity-100 [&_i]:size-3"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
