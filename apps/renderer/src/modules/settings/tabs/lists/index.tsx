import { WEB_URL } from "@follow/shared/constants"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { Avatar, AvatarImage } from "~/components/ui/avatar"
import { Button } from "~/components/ui/button"
import { Divider } from "~/components/ui/divider"
import { LoadingCircle } from "~/components/ui/loading"
import { useModalStack } from "~/components/ui/modal"
import { ScrollArea } from "~/components/ui/scroll-area"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import { Tooltip, TooltipContent, TooltipPortal, TooltipTrigger } from "~/components/ui/tooltip"
import { views } from "~/constants"
import { useAuthQuery, useI18n } from "~/hooks/common"
import { apiClient } from "~/lib/api-fetch"
import { cn } from "~/lib/utils"
import { Balance } from "~/modules/wallet/balance"
import { Queries } from "~/queries"
import { listActions } from "~/store/list"

import { ListCreationModalContent, ListFeedsModalContent } from "./modals"

export const SettingLists = () => {
  const t = useI18n()
  const listList = useAuthQuery(Queries.lists.list())

  const { present } = useModalStack()

  const deleteFeedList = useMutation({
    mutationFn: async (payload: { listId: string }) => {
      listActions.deleteList(payload.listId)
      await apiClient.lists.$delete({
        json: {
          listId: payload.listId,
        },
      })
    },
    onSuccess: () => {
      toast.success(t.settings("lists.delete.success"))
      Queries.lists.list().invalidate()
    },
    async onError() {
      toast.error(t.settings("lists.delete.error"))
    },
  })

  return (
    <section className="mt-4">
      <div className="mb-4 space-y-2 text-sm">
        <p>{t.settings("lists.info")}</p>
      </div>
      <Button
        onClick={() => {
          present({
            title: t.settings("lists.create"),
            content: () => <ListCreationModalContent />,
          })
        }}
      >
        <i className="i-mgc-add-cute-re mr-1 text-base" />
        {t.settings("lists.create")}
      </Button>
      <Divider className="mb-6 mt-8" />
      <div className="flex flex-1 flex-col">
        <ScrollArea.ScrollArea viewportClassName="max-h-[380px]">
          {listList.data?.length ? (
            <Table className="mt-4">
              <TableHeader className="border-b">
                <TableRow className="[&_*]:!font-semibold">
                  <TableHead size="sm">{t.settings("lists.title")}</TableHead>
                  <TableHead size="sm">{t.settings("lists.view")}</TableHead>
                  <TableHead size="sm">{t.settings("lists.fee.label")}</TableHead>
                  <TableHead size="sm">{t.settings("lists.subscriptions")}</TableHead>
                  <TableHead size="sm">{t.settings("lists.earnings")}</TableHead>
                  <TableHead size="sm" className="center">
                    {t.common("words.actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="border-t-[12px] border-transparent [&_td]:!px-3">
                {listList.data?.map((row) => (
                  <TableRow key={row.title} className="h-8">
                    <TableCell size="sm">
                      <a
                        target="_blank"
                        href={`${WEB_URL}/list/${row.id}`}
                        className="inline-flex items-center gap-2 font-semibold"
                      >
                        {row.image && (
                          <Avatar className="size-6">
                            <AvatarImage src={row.image} />
                          </Avatar>
                        )}
                        <span className="inline-block max-w-[200px] truncate">{row.title}</span>
                      </a>
                    </TableCell>
                    <TableCell size="sm">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span
                            className={cn("inline-flex items-center", views[row.view].className)}
                          >
                            {views[row.view].icon}
                          </span>
                        </TooltipTrigger>
                        <TooltipPortal>
                          <TooltipContent>{t(views[row.view].name)}</TooltipContent>
                        </TooltipPortal>
                      </Tooltip>
                    </TableCell>
                    <TableCell size="sm">
                      <div className="flex items-center gap-1">
                        {row.fee}
                        <i className="i-mgc-power shrink-0 text-lg text-accent" />
                      </div>
                    </TableCell>
                    <TableCell size="sm">{row.subscriptionCount}</TableCell>
                    <TableCell size="sm">
                      <Balance>{BigInt(row.purchaseAmount || 0n)}</Balance>
                    </TableCell>
                    <TableCell size="sm" className="center">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            onClick={() => {
                              present({
                                title: t.settings("lists.feeds.manage"),
                                content: () => <ListFeedsModalContent id={row.id} />,
                              })
                            }}
                          >
                            <i className="i-mgc-inbox-cute-re" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipPortal>
                          <TooltipContent>{t.common("words.manage")}</TooltipContent>
                        </TooltipPortal>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            onClick={() => {
                              present({
                                title: t.settings("lists.edit.label"),
                                content: () => <ListCreationModalContent id={row.id} />,
                              })
                            }}
                          >
                            <i className="i-mgc-edit-cute-re" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipPortal>
                          <TooltipContent>{t.common("words.edit")}</TooltipContent>
                        </TooltipPortal>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            onClick={() => {
                              deleteFeedList.mutate({ listId: row.id })
                            }}
                          >
                            <i className="i-mgc-delete-2-cute-re" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipPortal>
                          <TooltipContent>{t.common("words.delete")}</TooltipContent>
                        </TooltipPortal>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : listList.isLoading ? (
            <LoadingCircle size="large" className="center absolute inset-0" />
          ) : (
            <div className="mt-36 w-full text-center text-sm text-zinc-400">
              <p>{t.settings("lists.noLists")}</p>
            </div>
          )}
        </ScrollArea.ScrollArea>
      </div>
    </section>
  )
}
