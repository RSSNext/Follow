import { env } from "@follow/shared/env"
import { useMutation } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"

import { ActionButton, Button } from "~/components/ui/button"
import { CopyButton } from "~/components/ui/code-highlighter"
import { useModalStack } from "~/components/ui/modal"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import { apiClient } from "~/lib/api-fetch"
import { FeedViewType } from "~/lib/enum"
import { createErrorToaster } from "~/lib/error-parser"
import { useInboxList } from "~/queries/inboxes"
import { subscriptionActions } from "~/store/subscription"

import { InboxForm } from "./inbox-form"

export function DiscoverInboxList() {
  const { t } = useTranslation()
  const inboxes = useInboxList()

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
            <TableHead className="center px-0">{t("discover.inbox.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inboxes.data?.map((inbox) => (
            <TableRow key={inbox.id}>
              <TableCell size="sm">{inbox.id}</TableCell>
              <TableCell size="sm">
                <div className="group relative flex w-fit items-center gap-2">
                  <span className="shrink-0">
                    {inbox.id}
                    {env.VITE_INBOXES_EMAIL}
                  </span>
                  <CopyButton
                    value={`${inbox.id}${env.VITE_INBOXES_EMAIL}`}
                    className="absolute -right-6 p-1 opacity-0 group-hover:opacity-100 [&_i]:size-3"
                  />
                </div>
              </TableCell>
              <TableCell size="sm">{inbox.title}</TableCell>
              <TableCell size="sm">
                <div className="group relative flex w-fit items-center gap-2 font-mono">
                  <span className="shrink-0">****</span>
                  <CopyButton
                    value={inbox.secret}
                    className="absolute -right-6 p-1 opacity-0 group-hover:opacity-100 [&_i]:size-3"
                  />
                </div>
              </TableCell>
              <TableCell size="sm" className="center">
                <ActionButton
                  size="sm"
                  tooltip={t("discover.inbox_destroy")}
                  onClick={() =>
                    present({
                      title: t("discover.inbox_destroy_confirm"),
                      content: ({ dismiss }) => (
                        <ConfirmDestroyModalContent
                          id={inbox.id}
                          onSuccess={() => {
                            inboxes.refetch()
                            dismiss()
                          }}
                        />
                      ),
                    })
                  }
                >
                  <i className="i-mgc-delete-2-cute-re" />
                </ActionButton>
                <ActionButton
                  size="sm"
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
                </ActionButton>
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
              content: ({ dismiss }) => (
                <InboxForm
                  asWidget
                  onSuccess={() => {
                    inboxes.refetch()
                    dismiss()
                  }}
                />
              ),
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

const ConfirmDestroyModalContent = ({ id, onSuccess }: { id: string; onSuccess: () => void }) => {
  const { t } = useTranslation()

  const mutationDestroy = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.inboxes.$delete({
        json: {
          handle: id,
        },
      })
    },
    onSuccess: () => {
      subscriptionActions.fetchByView(FeedViewType.Articles)
      toast.success(t("discover.inbox_destroy_success"))
      onSuccess()
    },
    onError: createErrorToaster(t("discover.inbox_destroy_error")),
  })

  return (
    <div className="w-[512px]">
      <div className="mb-4">
        <i className="i-mingcute-warning-fill -mb-1 mr-1 size-5 text-red-500" />
        {t("discover.inbox_destroy_warning")}
      </div>
      <div className="flex justify-end">
        <Button className="bg-red-600" onClick={() => mutationDestroy.mutate(id)}>
          {t("words.confirm")}
        </Button>
      </div>
    </div>
  )
}
