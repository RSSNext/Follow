import { useMutation } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"

import { Button } from "~/components/ui/button"
import { useModalStack } from "~/components/ui/modal"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import { INBOXES_EMAIL_DOMAIN } from "~/constants"
import { apiClient } from "~/lib/api-fetch"
import { FeedViewType } from "~/lib/enum"
import { inboxActions, useInboxByView } from "~/store/inbox"

import { InboxForm } from "./inbox-form"

export function DiscoverInboxList({ onSuccess }: { onSuccess?: () => void; type?: string }) {
  const { t } = useTranslation()
  const inboxes = useInboxByView(FeedViewType.Articles)

  const mutationDestroy = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.inboxes.$delete({
        json: {
          handle: id,
        },
      })
      onSuccess?.()
    },
    onSuccess: (_, handle) => {
      inboxActions.clearByInboxId(handle)
      toast.success(t("discover.inbox_destroy_success"))
    },
    onError: () => {
      toast.error(t("discover.inbox_destroy_error"))
    },
  })

  const { present } = useModalStack()

  return (
    <>
      <div className="mb-4 flex items-center gap-2 text-sm text-zinc-500">
        <span>{t("discover.inbox.description")}</span>
        <a
          href="https://github.com/RSSNext/Follow/wiki/Inbox#webhooks"
          className="text-zinc-600 underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t("discover.inbox.webhooks_docs")}
        </a>
      </div>
      <Table className="mb-8 w-[600px]">
        <TableHeader>
          <TableRow>
            <TableHead className="pl-0 pr-6">{t("discover.inbox.handle")}</TableHead>
            <TableHead className="pl-0 pr-6">{t("discover.inbox.email")}</TableHead>
            <TableHead className="pl-0 pr-6">{t("discover.inbox.title")}</TableHead>
            <TableHead className="pl-0 pr-6">{t("discover.inbox.secret")}</TableHead>
            <TableHead className="px-0">{t("discover.inbox.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inboxes.map((inbox) => (
            <TableRow key={inbox.id}>
              <TableCell size="sm">{inbox.id}</TableCell>
              <TableCell size="sm">
                {inbox.id}@{INBOXES_EMAIL_DOMAIN}
              </TableCell>
              <TableCell size="sm">{inbox.title}</TableCell>
              <TableCell size="sm">{inbox.secret}</TableCell>
              <TableCell size="sm">
                <Button variant="ghost" onClick={() => mutationDestroy.mutate(inbox.id)}>
                  <i className="i-mgc-delete-2-cute-re" />
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    present({
                      title: t("sidebar.feed_actions.edit_inbox"),
                      content: ({ dismiss }) => (
                        <InboxForm asWidget id={inbox.id} onSuccess={dismiss} />
                      ),
                    })
                  }}
                >
                  <i className="i-mgc-edit-cute-re" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="center flex">
        <Button
          className="flex items-center gap-2"
          onClick={() =>
            present({
              title: t("sidebar.feed_actions.new_inbox"),
              content: ({ dismiss }) => <InboxForm asWidget onSuccess={dismiss} />,
            })
          }
        >
          <i className="i-mgc-add-cute-re" />
          {t("discover.inbox_create")}
        </Button>
      </div>
    </>
  )
}
