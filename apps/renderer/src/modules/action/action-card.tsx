import { Button } from "@follow/components/ui/button/index.js"
import { Card, CardContent, CardHeader } from "@follow/components/ui/card/index.jsx"
import { Divider } from "@follow/components/ui/divider/index.js"
import { Input } from "@follow/components/ui/input/index.js"
import { ResponsiveSelect } from "@follow/components/ui/select/responsive.js"
import { Switch } from "@follow/components/ui/switch/index.jsx"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@follow/components/ui/table/index.jsx"
import type { ActionModel, SupportedLanguages } from "@follow/models/types"
import { cn } from "@follow/utils/utils"
import { Fragment, useMemo } from "react"
import { useTranslation } from "react-i18next"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu/dropdown-menu"
import { actionActions, useActionByIndex } from "~/store/action"

import { FeedFilter } from "./feed-filter"

const DeleteTableCell = ({ disabled, onClick }: { disabled?: boolean; onClick?: () => void }) => (
  <TableCell size="sm" className="flex h-10 items-center">
    <Button variant="ghost" className="w-full" disabled={disabled} onClick={onClick}>
      <i className="i-mgc-delete-2-cute-re text-zinc-600" />
    </Button>
  </TableCell>
)

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
      <i className="i-mgc-add-cute-re" /> {t("actions.action_card.add")}
    </Button>
  )
}

type Action = {
  title: string
  config?: () => React.ReactNode
  configInline?: boolean
  enabled: boolean
  onInit: (data: ActionModel) => void
  onRemove: (data: ActionModel) => void
}

export const ActionCard = ({ index }: { index: number }) => {
  return (
    <Card>
      <CardHeader>
        <ActionCardToolbar index={index} />
      </CardHeader>
      <CardContent className="flex flex-wrap justify-between gap-x-10 gap-y-5">
        <FeedFilter index={index} />
        <ActionList index={index} />
      </CardContent>
    </Card>
  )
}

const ActionCardToolbar = ({ index }: { index: number }) => {
  const { t } = useTranslation("settings")

  const name = useActionByIndex(index, (a) => a.name)
  const disabled = useActionByIndex(index, (a) => a.result.disabled)

  const onChange = actionActions.updateByIndex.bind(null, index)
  return (
    <div className="flex w-full items-center gap-2">
      <Button
        variant="ghost"
        onClick={() => {
          actionActions.removeByIndex(index)
        }}
      >
        <i className="i-mgc-delete-2-cute-re text-zinc-600" />
      </Button>
      <p className="shrink-0 font-medium text-zinc-500">{t("actions.action_card.name")}</p>
      <Input
        value={name}
        className="h-8 max-w-64"
        onChange={(e) => {
          onChange((data) => {
            data.name = e.target.value
          })
        }}
      />
      <div className="grow" />

      <Switch
        checked={!disabled}
        onCheckedChange={(checked) => {
          onChange((data) => {
            data.result.disabled = !checked
          })
        }}
      />
    </div>
  )
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

const ActionList = ({ index }: { index: number }) => {
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
            value={translation}
            onValueChange={(value) => {
              onChange((data) => {
                data.result.translation = value
              })
            }}
            items={TransitionOptions}
            triggerClassName="w-fit max-w-44"
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead size="sm" />
                  <TableHead size="sm">{t("actions.action_card.from")}</TableHead>
                  <TableHead size="sm">{t("actions.action_card.to")}</TableHead>
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
    <div className="min-w-[270px] shrink grow space-y-4">
      <p className="font-medium text-zinc-500">{t("actions.action_card.then_do")}</p>
      <div className="w-full space-y-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild disabled={disabled}>
            <Button variant="outline" className={cn(notEnabledActions.length === 0 && "hidden")}>
              {t("actions.action_card.add_action")}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
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

        <section>
          {enabledActions
            .filter((action) => action.enabled)
            .map((action, index) => {
              return (
                <Fragment key={action.title}>
                  <div className="flex w-full items-center justify-between">
                    <span className="w-0 shrink grow truncate">{action.title}</span>
                    {action.configInline && action.config && action.config()}
                    <DeleteTableCell
                      disabled={disabled}
                      onClick={() => {
                        onChange((data) => {
                          action.onRemove(data)
                        })
                      }}
                    />
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
