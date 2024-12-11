import { Button } from "@follow/components/ui/button/index.js"
import { Card, CardHeader } from "@follow/components/ui/card/index.jsx"
import { Divider } from "@follow/components/ui/divider/index.js"
import { Input } from "@follow/components/ui/input/index.js"
import { Radio, RadioGroup } from "@follow/components/ui/radio-group/index.js"
import { Select, SelectTrigger, SelectValue } from "@follow/components/ui/select/index.jsx"
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
import type {
  ActionFeedField,
  ActionOperation,
  ActionsInput,
  SupportedLanguages,
} from "@follow/models/types"
import { cn } from "@follow/utils/utils"
import { Fragment, useMemo } from "react"
import { useTranslation } from "react-i18next"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu/dropdown-menu"
import { ViewSelectContent } from "~/modules/feed/view-select-content"

const FieldTableHeader = () => {
  const { t } = useTranslation("settings")
  return (
    <TableHeader className="max-sm:hidden">
      <TableRow>
        <TableHead size="sm">{t("actions.action_card.field")}</TableHead>
        <TableHead size="sm">{t("actions.action_card.operator")}</TableHead>
        <TableHead size="sm">{t("actions.action_card.value")}</TableHead>
        <TableHead size="sm" />
      </TableRow>
    </TableHeader>
  )
}

const DeleteTableCell = ({ disabled, onClick }: { disabled?: boolean; onClick?: () => void }) => (
  <TableCell size="sm" className="flex h-10 items-center">
    <Button variant="ghost" className="w-full" disabled={disabled} onClick={onClick}>
      <i className="i-mgc-delete-2-cute-re text-zinc-600" />
    </Button>
  </TableCell>
)

const ActionTableCell = ({
  disabled,
  onAnd,
  onDelete,
}: {
  disabled?: boolean
  onAnd?: () => void
  onDelete?: () => void
}) => {
  const { t } = useTranslation("settings")
  return (
    <>
      <TableCell size="sm" className="max-sm:flex max-sm:space-x-2 max-sm:pr-0">
        <Button variant="ghost" className="sm:w-full" disabled={disabled} onClick={onDelete}>
          <i className="i-mgc-delete-2-cute-re text-zinc-600" />
        </Button>
        <Button className="w-full sm:hidden" variant="outline" disabled={disabled} onClick={onAnd}>
          {t("actions.action_card.and")}
        </Button>
      </TableCell>
      <TableCell size="sm" className="max-sm:hidden">
        <Button variant="outline" className="w-full" disabled={disabled} onClick={onAnd}>
          {t("actions.action_card.and")}
        </Button>
      </TableCell>
    </>
  )
}

const OrTableRow = ({ onClick, disabled }: { onClick?: () => void; disabled?: boolean }) => {
  const { t } = useTranslation("settings")
  return (
    <Button
      variant="outline"
      className="mt-1 w-full gap-1"
      buttonClassName="py-1"
      onClick={onClick}
      disabled={disabled}
    >
      {t("actions.action_card.or")}
    </Button>
  )
}

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

const OperationTableCell = ({
  type,
  value,
  onValueChange,
  disabled,
}: {
  type: string
  value?: ActionOperation
  onValueChange?: (value: ActionOperation) => void
  disabled?: boolean
}) => {
  const { t } = useTranslation("settings")

  const OperationOptions = useMemo(() => {
    return [
      {
        label: t("actions.action_card.operation_options.contains"),
        value: "contains",
        types: ["text"],
      },
      {
        label: t("actions.action_card.operation_options.does_not_contain"),
        value: "not_contains",
        types: ["text"],
      },
      {
        label: t("actions.action_card.operation_options.is_equal_to"),
        value: "eq",
        types: ["number", "text", "view"],
      },
      {
        label: t("actions.action_card.operation_options.is_not_equal_to"),
        value: "not_eq",
        types: ["number", "text", "view"],
      },
      {
        label: t("actions.action_card.operation_options.is_greater_than"),
        value: "gt",
        types: ["number"],
      },
      {
        label: t("actions.action_card.operation_options.is_less_than"),
        value: "lt",
        types: ["number"],
      },
      {
        label: t("actions.action_card.operation_options.matches_regex"),
        value: "regex",
        types: ["text"],
      },
    ]
  }, [t])

  const options = OperationOptions.filter((option) => option.types.includes(type))
  return (
    <TableCell
      size="sm"
      className="max-sm:flex max-sm:items-center max-sm:justify-between max-sm:pr-0"
    >
      <span className="sm:hidden">{t("actions.action_card.operator")}</span>
      <ResponsiveSelect
        disabled={disabled}
        value={value}
        onValueChange={(value) => onValueChange?.(value as ActionOperation)}
        items={options}
        triggerClassName="h-8 max-sm:w-fit"
      />
    </TableCell>
  )
}

const CommonSelectTrigger = ({ className }: { className?: string }) => (
  <SelectTrigger className={cn("h-8", className)}>
    <SelectValue />
  </SelectTrigger>
)

type Action = {
  title: string
  config?: () => React.ReactNode
  configInline?: boolean
  enabled: boolean
  onInit: () => void
  onRemove: () => void
}

export function ActionCard({
  data,
  onChange,
}: {
  data: ActionsInput[number]
  onChange: (data: ActionsInput[number] | null) => void
}) {
  const { t } = useTranslation("settings")

  return (
    <Card>
      <CardHeader className="space-y-4 px-6 py-4">
        <div className="flex w-full items-center gap-2 pr-2">
          <Button
            variant="ghost"
            onClick={() => {
              onChange(null)
            }}
          >
            <i className="i-mgc-delete-2-cute-re text-zinc-600" />
          </Button>
          <p className="shrink-0 font-medium text-zinc-500">{t("actions.action_card.name")}</p>
          <Input
            value={data.name}
            className="h-8 max-w-64"
            onChange={(e) => {
              data.name = e.target.value
              onChange(data)
            }}
          />
          <div className="grow" />

          <Switch
            checked={!data.result.disabled}
            onCheckedChange={(checked) => {
              data.result.disabled = !checked
              onChange(data)
            }}
          />
        </div>
        <div className="mt-4 flex flex-wrap justify-between gap-x-10 gap-y-5 px-1">
          <FeedFilter data={data} onChange={onChange} />
          <ActionList data={data} onChange={onChange} />
        </div>
      </CardHeader>
    </Card>
  )
}

function FeedFilter({
  data,
  onChange,
}: {
  data: ActionsInput[number]
  onChange: (data: ActionsInput[number] | null) => void
}) {
  const { t } = useTranslation("settings")

  const FeedOptions = useMemo(() => {
    return [
      {
        label: t("actions.action_card.feed_options.subscription_view"),
        value: "view",
        type: "view",
      },
      {
        label: t("actions.action_card.feed_options.feed_title"),
        value: "title",
      },
      {
        label: t("actions.action_card.feed_options.feed_category"),
        value: "category",
      },
      {
        label: t("actions.action_card.feed_options.site_url"),
        value: "site_url",
      },
      {
        label: t("actions.action_card.feed_options.feed_url"),
        value: "feed_url",
      },
      {
        label: t("actions.action_card.feed_options.entry_title"),
        value: "entry_title",
      },
      {
        label: t("actions.action_card.feed_options.entry_content"),
        value: "entry_content",
      },
      {
        label: t("actions.action_card.feed_options.entry_url"),
        value: "entry_url",
      },
      {
        label: t("actions.action_card.feed_options.entry_author"),
        value: "entry_author",
      },
      {
        label: t("actions.action_card.feed_options.entry_media_length"),
        value: "entry_media_length",
        type: "number",
      },
    ]
  }, [t])

  const { disabled } = data.result
  return (
    <div className="shrink grow space-y-3 overflow-auto">
      <p className="font-medium text-zinc-500">{t("actions.action_card.when_feeds_match")}</p>
      <div className="flex flex-col gap-2">
        <RadioGroup
          value={data.condition.length > 0 ? "filter" : "all"}
          onValueChange={(value) => {
            if (value === "all") {
              data.condition = []
            } else {
              data.condition = [[{}]]
            }
            onChange(data)
          }}
        >
          <Radio disabled={disabled} label={t("actions.action_card.all")} value="all" />
          <Radio
            disabled={disabled}
            label={t("actions.action_card.custom_filters")}
            value="filter"
          />
        </RadioGroup>
      </div>

      {data.condition.length > 0 && (
        <div>
          <Table>
            <FieldTableHeader />
            <TableBody>
              {data.condition.flatMap((orConditions, orConditionIdx) => {
                return orConditions.map((condition, conditionIdx) => {
                  const change = (key: string, value: string | number) => {
                    if (!data.condition[orConditionIdx]) {
                      data.condition[orConditionIdx] = [{}]
                    }
                    data.condition[orConditionIdx][conditionIdx][key] = value
                    onChange(data)
                  }
                  const type =
                    FeedOptions.find((option) => option.value === condition.field)?.type || "text"
                  return (
                    <Fragment key={`${orConditionIdx}${conditionIdx}`}>
                      {conditionIdx === 0 && orConditionIdx !== 0 && (
                        <TableRow className="flex h-16 items-center">
                          <Button disabled variant="outline">
                            {t("actions.action_card.or")}
                          </Button>
                        </TableRow>
                      )}
                      <TableRow className="max-sm:flex max-sm:flex-col">
                        <TableCell
                          size="sm"
                          className="max-sm:flex max-sm:items-center max-sm:justify-between max-sm:pr-0"
                        >
                          <span className="sm:hidden">{t("actions.action_card.field")}</span>
                          <ResponsiveSelect
                            disabled={disabled}
                            value={condition.field}
                            onValueChange={(value) => change("field", value as ActionFeedField)}
                            items={FeedOptions}
                            triggerClassName="max-sm:w-fit"
                          />
                        </TableCell>
                        <OperationTableCell
                          type={type}
                          disabled={disabled}
                          value={condition.operator}
                          onValueChange={(value) => change("operator", value)}
                        />
                        <TableCell
                          size="sm"
                          className="max-sm:flex max-sm:items-center max-sm:justify-between max-sm:gap-4 max-sm:pr-0"
                        >
                          <span className="sm:hidden">{t("actions.action_card.value")}</span>
                          {type === "view" ? (
                            <Select
                              disabled={disabled}
                              onValueChange={(value) => change("value", value)}
                              value={condition.value}
                            >
                              <CommonSelectTrigger className="max-sm:w-fit" />
                              <ViewSelectContent />
                            </Select>
                          ) : (
                            <Input
                              disabled={disabled}
                              type={type}
                              value={condition.value}
                              className="h-8"
                              onChange={(e) => change("value", e.target.value)}
                            />
                          )}
                        </TableCell>
                        <ActionTableCell
                          disabled={disabled}
                          onAnd={() => {
                            data.condition[orConditionIdx].push({})
                            onChange(data)
                          }}
                          onDelete={() => {
                            if (data.condition[orConditionIdx].length === 1) {
                              data.condition.splice(orConditionIdx, 1)
                            } else {
                              data.condition[orConditionIdx].splice(conditionIdx, 1)
                            }
                            onChange(data)
                          }}
                        />
                      </TableRow>
                      {conditionIdx !== orConditions.length - 1 && (
                        <TableRow className="relative flex items-center">
                          <Button disabled variant="outline">
                            {t("actions.action_card.and")}
                          </Button>
                        </TableRow>
                      )}
                    </Fragment>
                  )
                })
              })}
            </TableBody>
          </Table>
          <OrTableRow
            disabled={disabled}
            onClick={() => {
              data.condition.push([{}])
              onChange(data)
            }}
          />
        </div>
      )}
    </div>
  )
}

function ActionList({
  data,
  onChange,
}: {
  data: ActionsInput[number]
  onChange: (data: ActionsInput[number] | null) => void
}) {
  const { disabled } = data.result
  const { t } = useTranslation("settings")

  const TransitionOptions: {
    label: string
    value: SupportedLanguages
  }[] = useMemo(() => {
    return [
      {
        label: t("actions.action_card.no_translation"),
        value: "none" as SupportedLanguages,
      },
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
  }, [t])

  const availableActions: Action[] = useMemo(
    () => [
      {
        title: t("actions.action_card.generate_summary"),
        enabled: !!data.result.summary,
        onInit: () => {
          data.result.summary = true
        },
        onRemove: () => {
          delete data.result.summary
        },
      },
      {
        title: t("actions.action_card.translate_into"),
        enabled: !!data.result.translation,
        onInit: () => {
          data.result.translation = "none"
        },
        onRemove: () => {
          delete data.result.translation
        },
        config: () => (
          <ResponsiveSelect
            disabled={disabled}
            value={data.result.translation}
            onValueChange={(value) => {
              if (value === "none") {
                delete data.result.translation
              } else {
                data.result.translation = value
              }
              onChange(data)
            }}
            items={TransitionOptions}
            triggerClassName="w-fit max-w-44"
          />
        ),
        configInline: true,
      },
      {
        title: t("actions.action_card.enable_readability"),
        enabled: !!data.result.readability,
        onInit: () => {
          data.result.readability = true
        },
        onRemove: () => {
          delete data.result.readability
        },
      },
      {
        title: t("actions.action_card.source_content"),
        enabled: !!data.result.sourceContent,
        onInit: () => {
          data.result.sourceContent = true
        },
        onRemove: () => {
          delete data.result.sourceContent
        },
      },
      {
        title: t("actions.action_card.new_entry_notification"),
        enabled: !!data.result.newEntryNotification,
        onInit: () => {
          data.result.newEntryNotification = true
        },
        onRemove: () => {
          delete data.result.newEntryNotification
        },
      },
      {
        title: t("actions.action_card.silence"),
        enabled: !!data.result.silence,
        onInit: () => {
          data.result.silence = true
        },
        onRemove: () => {
          delete data.result.silence
        },
      },
      {
        title: t("actions.action_card.block"),
        enabled: !!data.result.block,
        onInit: () => {
          data.result.block = true
        },
        onRemove: () => {
          delete data.result.block
        },
      },
      {
        title: t("actions.action_card.rewrite_rules"),
        enabled: !!data.result.rewriteRules,
        onInit: () => {
          data.result.rewriteRules = [
            {
              from: "",
              to: "",
            },
          ]
        },
        onRemove: () => {
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
                {data.result.rewriteRules?.map((rule, rewriteIdx) => {
                  const change = (key: string, value: string) => {
                    data.result.rewriteRules![rewriteIdx][key] = value
                    onChange(data)
                  }
                  return (
                    <TableRow key={rewriteIdx}>
                      <DeleteTableCell
                        disabled={disabled}
                        onClick={() => {
                          if (data.result.rewriteRules?.length === 1) {
                            delete data.result.rewriteRules
                          } else {
                            data.result.rewriteRules?.splice(rewriteIdx, 1)
                          }
                          onChange(data)
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
                if (!data.result.rewriteRules) {
                  data.result.rewriteRules = []
                }
                data.result.rewriteRules!.push({
                  from: "",
                  to: "",
                })
                onChange(data)
              }}
            />
          </>
        ),
      },
      {
        title: t("actions.action_card.webhooks"),
        enabled: !!data.result.webhooks,
        onInit: () => {
          data.result.webhooks = [""]
        },
        onRemove: () => {
          delete data.result.webhooks
        },
        config: () => (
          <>
            {data.result.webhooks?.map((webhook, rewriteIdx) => {
              return (
                <div key={rewriteIdx} className="flex items-center gap-2">
                  <DeleteTableCell
                    disabled={disabled}
                    onClick={() => {
                      if (data.result.webhooks?.length === 1) {
                        delete data.result.webhooks
                      } else {
                        data.result.webhooks?.splice(rewriteIdx, 1)
                      }
                      onChange(data)
                    }}
                  />
                  <Input
                    disabled={disabled}
                    value={webhook}
                    className="h-8"
                    placeholder="https://"
                    onChange={(e) => {
                      data.result.webhooks![rewriteIdx] = e.target.value
                      onChange(data)
                    }}
                  />
                </div>
              )
            })}
            <AddTableRow
              disabled={disabled}
              onClick={() => {
                if (!data.result.webhooks) {
                  data.result.webhooks = []
                }
                data.result.webhooks!.push("")
                onChange(data)
              }}
            />
          </>
        ),
      },
    ],
    [TransitionOptions, data, disabled, onChange, t],
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
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className={cn(notEnabledActions.length === 0 && "hidden")}>
              Add Action
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {notEnabledActions.map((action) => {
              return (
                <DropdownMenuItem
                  key={action.title}
                  onClick={() => {
                    action.onInit()
                    onChange(data)
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
                        action.onRemove()
                        onChange(data)
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
