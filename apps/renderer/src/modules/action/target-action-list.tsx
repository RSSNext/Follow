import { ActionButton, Button } from "@follow/components/ui/button/index.js"
import { Divider } from "@follow/components/ui/divider/index.js"
import { Input } from "@follow/components/ui/input/index.js"
import { ResponsiveSelect } from "@follow/components/ui/select/responsive.js"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@follow/components/ui/table/index.jsx"
import type { ActionModel, SupportedLanguages } from "@follow/models/types"
import { Fragment, useMemo } from "react"
import { useTranslation } from "react-i18next"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu/dropdown-menu"
import { actionActions, useActionByIndex } from "~/store/action"

type Action = {
  title: string
  config?: () => React.ReactNode
  configInline?: boolean
  enabled: boolean
  onInit: (data: ActionModel) => void
  onRemove: (data: ActionModel) => void
}

const TransitionOptions: {
  label: string
  value: SupportedLanguages
}[] = [
  {
    label: "English",
    value: "en",
  },
  {
    label: "日本語",
    value: "ja",
  },
  {
    label: "简体中文",
    value: "zh-CN",
  },
  {
    label: "繁體中文",
    value: "zh-TW",
  },
]

const AddTableRow = ({ onClick, disabled }: { onClick?: () => void; disabled?: boolean }) => {
  const { t } = useTranslation("settings")
  return (
    <Button
      variant="outline"
      className="mt-1 w-full gap-1"
      buttonClassName="py-1"
      onClick={onClick}
      disabled={disabled}
    >
      {t("actions.action_card.add")}
    </Button>
  )
}

const DeleteTableCell = ({ disabled, onClick }: { disabled?: boolean; onClick?: () => void }) => (
  <TableCell size="sm" className="flex h-10 items-center">
    <ActionButton disabled={disabled} onClick={onClick}>
      <i className="i-mgc-delete-2-cute-re text-zinc-600" />
    </ActionButton>
  </TableCell>
)

export const TargetActionList = ({ index }: { index: number }) => {
  const summary = useActionByIndex(index, (a) => a.result.summary)
  const translation = useActionByIndex(index, (a) => a.result.translation)
  const readability = useActionByIndex(index, (a) => a.result.readability)
  const sourceContent = useActionByIndex(index, (a) => a.result.sourceContent)
  const newEntryNotification = useActionByIndex(index, (a) => a.result.newEntryNotification)
  const silence = useActionByIndex(index, (a) => a.result.silence)
  const block = useActionByIndex(index, (a) => a.result.block)
  const rewriteRules = useActionByIndex(index, (a) => a.result.rewriteRules)
  const webhooks = useActionByIndex(index, (a) => a.result.webhooks)

  const disabled = useActionByIndex(index, (a) => a.result.disabled)
  const { t } = useTranslation("settings")

  const onChange = actionActions.updateByIndex.bind(null, index)

  const availableActions: Action[] = useMemo(
    () => [
      {
        title: t("actions.action_card.generate_summary"),
        enabled: !!summary,
        onInit: (data) => {
          data.result.summary = true
        },
        onRemove: (data) => {
          delete data.result.summary
        },
      },
      {
        title: t("actions.action_card.translate_into"),
        enabled: !!translation,
        onInit: (data) => {
          data.result.translation = "zh-CN"
        },
        onRemove: (data) => {
          delete data.result.translation
        },
        config: () => (
          <ResponsiveSelect
            disabled={disabled}
            size="sm"
            value={translation}
            onValueChange={(value) => {
              onChange((data) => {
                data.result.translation = value
              })
            }}
            items={TransitionOptions}
            triggerClassName="w-fit max-w-44 text-sm"
          />
        ),
        configInline: true,
      },
      {
        title: t("actions.action_card.enable_readability"),
        enabled: !!readability,
        onInit: (data) => {
          data.result.readability = true
        },
        onRemove: (data) => {
          delete data.result.readability
        },
      },
      {
        title: t("actions.action_card.source_content"),
        enabled: !!sourceContent,
        onInit: (data) => {
          data.result.sourceContent = true
        },
        onRemove: (data) => {
          delete data.result.sourceContent
        },
      },
      {
        title: t("actions.action_card.new_entry_notification"),
        enabled: !!newEntryNotification,
        onInit: (data) => {
          data.result.newEntryNotification = true
        },
        onRemove: (data) => {
          delete data.result.newEntryNotification
        },
      },
      {
        title: t("actions.action_card.silence"),
        enabled: !!silence,
        onInit: (data) => {
          data.result.silence = true
        },
        onRemove: (data) => {
          delete data.result.silence
        },
      },
      {
        title: t("actions.action_card.block"),
        enabled: !!block,
        onInit: (data) => {
          data.result.block = true
        },
        onRemove: (data) => {
          delete data.result.block
        },
      },
      {
        title: t("actions.action_card.rewrite_rules"),
        enabled: !!rewriteRules,
        onInit: (data) => {
          data.result.rewriteRules = [
            {
              from: "",
              to: "",
            },
          ]
        },
        onRemove: (data) => {
          delete data.result.rewriteRules
        },
        config: () => (
          <>
            <Table className="mt-2">
              <TableHeader>
                <TableRow>
                  <TableHead size="sm">{t("actions.action_card.from")}</TableHead>
                  <TableHead size="sm">{t("actions.action_card.to")}</TableHead>
                  <TableHead size="sm" className="w-8" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {rewriteRules?.map((rule, rewriteIdx) => {
                  const change = (key: string, value: string) => {
                    onChange((data) => {
                      data.result.rewriteRules![rewriteIdx][key] = value
                    })
                  }
                  return (
                    <TableRow key={rewriteIdx}>
                      <TableCell size="sm">
                        <Input
                          disabled={disabled}
                          value={rule.from}
                          className="h-8"
                          onChange={(e) => change("from", e.target.value)}
                        />
                      </TableCell>
                      <TableCell size="sm">
                        <Input
                          disabled={disabled}
                          value={rule.to}
                          className="h-8"
                          onChange={(e) => change("to", e.target.value)}
                        />
                      </TableCell>
                      <DeleteTableCell
                        disabled={disabled}
                        onClick={() => {
                          onChange((data) => {
                            if (data.result.rewriteRules?.length === 1) {
                              delete data.result.rewriteRules
                            } else {
                              data.result.rewriteRules?.splice(rewriteIdx, 1)
                            }
                          })
                        }}
                      />
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
            <AddTableRow
              disabled={disabled}
              onClick={() => {
                onChange((data) => {
                  if (!data.result.rewriteRules) {
                    data.result.rewriteRules = []
                  }
                  data.result.rewriteRules!.push({
                    from: "",
                    to: "",
                  })
                })
              }}
            />
          </>
        ),
      },
      {
        title: t("actions.action_card.webhooks"),
        enabled: !!webhooks,
        onInit: (data) => {
          data.result.webhooks = [""]
        },
        onRemove: (data) => {
          delete data.result.webhooks
        },
        config: () => (
          <>
            {webhooks?.map((webhook, rewriteIdx) => {
              return (
                <div key={rewriteIdx} className="flex items-center gap-2">
                  <Input
                    disabled={disabled}
                    value={webhook}
                    className="h-8"
                    placeholder="https://"
                    onChange={(e) => {
                      onChange((data) => {
                        data.result.webhooks![rewriteIdx] = e.target.value
                      })
                    }}
                  />
                  <DeleteTableCell
                    disabled={disabled}
                    onClick={() => {
                      onChange((data) => {
                        if (data.result.webhooks?.length === 1) {
                          delete data.result.webhooks
                        } else {
                          data.result.webhooks?.splice(rewriteIdx, 1)
                        }
                      })
                    }}
                  />
                </div>
              )
            })}
            <AddTableRow
              disabled={disabled}
              onClick={() => {
                onChange((data) => {
                  if (!data.result.webhooks) {
                    data.result.webhooks = []
                  }
                  data.result.webhooks!.push("")
                })
              }}
            />
          </>
        ),
      },
    ],
    [
      block,
      disabled,
      newEntryNotification,
      onChange,
      readability,
      rewriteRules,
      silence,
      sourceContent,
      summary,
      t,
      translation,
      webhooks,
    ],
  )
  const enabledActions = useMemo(
    () => availableActions.filter((action) => action.enabled),
    [availableActions],
  )
  const notEnabledActions = useMemo(
    () => availableActions.filter((action) => !action.enabled),
    [availableActions],
  )

  return (
    <div className="w-full shrink grow space-y-4">
      <p className="font-medium text-zinc-500">{t("actions.action_card.then_do")}</p>
      <div className="relative w-full space-y-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild disabled={disabled}>
            <ActionButton className="absolute right-0 top-0 -translate-y-11 text-zinc-500 duration-200 hover:text-foreground">
              <i className="i-mgc-add-cute-re" />
            </ActionButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="left" align="start">
            {notEnabledActions.map((action) => {
              return (
                <DropdownMenuItem
                  key={action.title}
                  onClick={() => {
                    onChange((data) => {
                      action.onInit(data)
                    })
                  }}
                >
                  {action.title}
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        <section className="pl-6">
          {enabledActions
            .filter((action) => action.enabled)
            .map((action, index) => {
              return (
                <Fragment key={action.title}>
                  <div className="group/action mt-3 flex w-full items-center justify-between">
                    <span className="w-0 shrink grow truncate">{action.title}</span>
                    {action.configInline && action.config && action.config()}

                    <Button
                      buttonClassName="absolute opacity-100 group-hover/action:opacity-70 hover:!opacity-100 duration-200 lg:opacity-0 left-0 z-[1] size-5 rounded-full border"
                      variant={"ghost"}
                      disabled={disabled}
                      onClick={() => {
                        onChange((data) => {
                          action.onRemove(data)
                        })
                      }}
                    >
                      <i className="i-mgc-close-cute-re size-3" />
                    </Button>
                  </div>
                  {!action.configInline && action.config && action.config()}
                  {index !== enabledActions.length - 1 && <Divider className="my-2" />}
                </Fragment>
              )
            })}
        </section>
      </div>
    </div>
  )
}
