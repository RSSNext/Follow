import { Button } from "@follow/components/ui/button/index.js"
import { Card, CardHeader } from "@follow/components/ui/card/index.jsx"
import { Divider } from "@follow/components/ui/divider/index.js"
import { Input } from "@follow/components/ui/input/index.js"
import { Radio, RadioGroup } from "@follow/components/ui/radio-group/index.js"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@follow/components/ui/select/index.jsx"
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
import { stopPropagation } from "@follow/utils/dom"
import { cn } from "@follow/utils/utils"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

import { Collapse, CollapseControlled } from "~/components/ui/collapse"
import { ViewSelectContent } from "~/modules/feed/view-select-content"

const TransitionOptions: {
  name: string
  value: SupportedLanguages
}[] = [
  {
    name: "English",
    value: "en",
  },
  {
    name: "日本語",
    value: "ja",
  },
  {
    name: "简体中文",
    value: "zh-CN",
  },
  {
    name: "繁體中文",
    value: "zh-TW",
  },
]

const FieldTableHeader = () => {
  const { t } = useTranslation("settings")
  return (
    <TableHeader>
      <TableRow>
        <TableHead size="sm" />
        <TableHead size="sm">{t("actions.action_card.field")}</TableHead>
        <TableHead size="sm">{t("actions.action_card.operator")}</TableHead>
        <TableHead size="sm">{t("actions.action_card.value")}</TableHead>
      </TableRow>
    </TableHeader>
  )
}

const DeleteTableCell = ({ disabled, onClick }: { disabled?: boolean; onClick?: () => void }) => (
  <TableCell size="sm" className="flex h-10 items-center pr-1">
    <Button variant="ghost" className="w-full px-0" disabled={disabled} onClick={onClick}>
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
        name: t("actions.action_card.operation_options.contains"),
        value: "contains",
        types: ["text"],
      },
      {
        name: t("actions.action_card.operation_options.does_not_contain"),
        value: "not_contains",
        types: ["text"],
      },
      {
        name: t("actions.action_card.operation_options.is_equal_to"),
        value: "eq",
        types: ["number", "text", "view"],
      },
      {
        name: t("actions.action_card.operation_options.is_not_equal_to"),
        value: "not_eq",
        types: ["number", "text", "view"],
      },
      {
        name: t("actions.action_card.operation_options.is_greater_than"),
        value: "gt",
        types: ["number"],
      },
      {
        name: t("actions.action_card.operation_options.is_less_than"),
        value: "lt",
        types: ["number"],
      },
      {
        name: t("actions.action_card.operation_options.matches_regex"),
        value: "regex",
        types: ["text"],
      },
    ]
  }, [t])

  const options = OperationOptions.filter((option) => option.types.includes(type))
  return (
    <TableCell size="sm">
      <Select disabled={disabled} value={value} onValueChange={onValueChange}>
        <SelectTrigger className="h-8">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </TableCell>
  )
}

const SettingCollapsible = ({
  title,
  onOpenChange,
  children,
}: {
  title: string
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) => {
  const [open, setOpen] = useState(false)

  const toggleOpen = () => {
    setOpen((pre) => !pre)
    onOpenChange && onOpenChange(!open)
  }

  if (typeof open === "boolean" && typeof onOpenChange === "function") {
    return (
      <CollapseControlled isOpened={open} onOpenChange={toggleOpen} title={title}>
        <div className="px-1 pt-2">{children}</div>
      </CollapseControlled>
    )
  }

  return (
    <Collapse title={title}>
      <div className="pt-2">{children}</div>
    </Collapse>
  )
}

const CommonSelectTrigger = ({ className }: { className?: string }) => (
  <SelectTrigger className={cn("h-8", className)}>
    <SelectValue />
  </SelectTrigger>
)

export function ActionCard({
  data,
  onChange,
}: {
  data: ActionsInput[number]
  onChange: (data: ActionsInput[number] | null) => void
}) {
  const { t } = useTranslation("settings")

  const EntryOptions = useMemo(() => {
    return [
      {
        name: t("actions.action_card.entry_options.all"),
        value: "all",
      },
      {
        name: t("actions.action_card.entry_options.title"),
        value: "title",
      },
      {
        name: t("actions.action_card.entry_options.content"),
        value: "content",
      },
      {
        name: t("actions.action_card.entry_options.author"),
        value: "author",
      },
      {
        name: t("actions.action_card.entry_options.url"),
        value: "url",
      },
      {
        name: t("actions.action_card.entry_options.order"),
        value: "order",
        type: "number",
      },
    ]
  }, [t])

  const FeedOptions = useMemo(() => {
    return [
      {
        name: t("actions.action_card.feed_options.view"),
        value: "view",
        type: "view",
      },
      {
        name: t("actions.action_card.feed_options.title"),
        value: "title",
      },
      {
        name: t("actions.action_card.feed_options.category"),
        value: "category",
      },
      {
        name: t("actions.action_card.feed_options.site_url"),
        value: "site_url",
      },
      {
        name: t("actions.action_card.feed_options.feed_url"),
        value: "feed_url",
      },
    ]
  }, [t])

  const { disabled } = data.result

  return (
    <Card>
      <CardHeader className="space-y-4 px-6 py-4">
        <Collapse
          className="[&_.name-placeholder]:data-[state=open]:hidden [&_input.name-input]:data-[state=open]:block"
          title={
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
                className="name-input hidden h-8"
                onClick={stopPropagation}
                onChange={(e) => {
                  data.name = e.target.value
                  onChange(data)
                }}
              />

              <div className="name-placeholder flex-1 text-sm">{data.name}</div>
              <Switch
                checked={!data.result.disabled}
                onCheckedChange={(checked) => {
                  data.result.disabled = !checked
                  onChange(data)
                }}
                onClick={stopPropagation}
              />
            </div>
          }
        >
          <div className="mt-4 space-y-4 px-1">
            <div className="space-y-3">
              <p className="font-medium text-zinc-500">
                {t("actions.action_card.when_feeds_match")}
              </p>
              <div className="flex flex-col gap-2">
                <RadioGroup
                  value={data.condition.length > 0 ? "filter" : "all"}
                  onValueChange={(value) => {
                    if (value === "all") {
                      data.condition = []
                    } else {
                      data.condition = [{}]
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
                      {data.condition.map((condition, conditionIdx) => {
                        const change = (key: string, value: string | number) => {
                          if (!data.condition[conditionIdx]) {
                            data.condition[conditionIdx] = {}
                          }
                          data.condition[conditionIdx][key] = value
                          onChange(data)
                        }
                        const type =
                          FeedOptions.find((option) => option.value === condition.field)?.type ||
                          "text"
                        return (
                          <TableRow key={conditionIdx}>
                            <DeleteTableCell
                              disabled={disabled}
                              onClick={() => {
                                data.condition.splice(conditionIdx, 1)
                                onChange(data)
                              }}
                            />
                            <TableCell size="sm">
                              <Select
                                disabled={disabled}
                                value={condition.field}
                                onValueChange={(value: ActionFeedField) => change("field", value)}
                              >
                                <CommonSelectTrigger />
                                <SelectContent>
                                  {FeedOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <OperationTableCell
                              type={type}
                              disabled={disabled}
                              value={condition.operator}
                              onValueChange={(value) => change("operator", value)}
                            />
                            <TableCell size="sm">
                              {type === "view" ? (
                                <Select
                                  disabled={disabled}
                                  onValueChange={(value) => change("value", value)}
                                  value={condition.value}
                                >
                                  <CommonSelectTrigger />
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
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                  <AddTableRow
                    disabled={disabled}
                    onClick={() => {
                      data.condition.push({})
                      onChange(data)
                    }}
                  />
                </div>
              )}
            </div>
            <div className="space-y-4">
              <p className="font-medium text-zinc-500">{t("actions.action_card.then_do")}</p>
              <div className="w-full space-y-4">
                <div className="flex w-full items-center justify-between">
                  <span className="w-0 shrink grow truncate">
                    {t("actions.action_card.generate_summary")}
                  </span>
                  <Switch
                    disabled={disabled}
                    checked={data.result.summary}
                    onCheckedChange={(checked) => {
                      data.result.summary = checked
                      onChange(data)
                    }}
                  />
                </div>
                <Divider />

                <div className="flex w-full items-center justify-between">
                  <span className="w-0 shrink grow truncate">
                    {t("actions.action_card.translate_into")}
                  </span>
                  <Select
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
                  >
                    <CommonSelectTrigger className="max-w-44" />
                    <SelectContent>
                      {[
                        {
                          name: t("actions.action_card.no_translation"),
                          value: "none",
                        },
                        ...TransitionOptions,
                      ].map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Divider />

                <div className="flex w-full items-center justify-between">
                  <span className="w-0 shrink grow truncate">
                    {t("actions.action_card.enable_readability")}
                  </span>
                  <Switch
                    disabled={disabled}
                    checked={data.result.readability}
                    onCheckedChange={(checked) => {
                      data.result.readability = checked
                      onChange(data)
                    }}
                  />
                </div>
                <Divider />

                <div className="flex w-full items-center justify-between">
                  <span className="w-0 shrink grow truncate">
                    {t("actions.action_card.source_content")}
                  </span>
                  <Switch
                    disabled={disabled}
                    checked={data.result.sourceContent}
                    onCheckedChange={(checked) => {
                      data.result.sourceContent = checked
                      onChange(data)
                    }}
                  />
                </div>
                <Divider />

                <div className="flex w-full items-center justify-between">
                  <span className="w-0 shrink grow truncate">
                    {t("actions.action_card.new_entry_notification")}
                  </span>
                  <Switch
                    disabled={disabled}
                    checked={data.result.newEntryNotification}
                    onCheckedChange={(checked) => {
                      data.result.newEntryNotification = checked
                      onChange(data)
                    }}
                  />
                </div>
                <Divider />

                <div className="flex w-full items-center justify-between">
                  <span className="w-0 shrink grow truncate">
                    {t("actions.action_card.silence")}
                  </span>
                  <Switch
                    disabled={disabled}
                    checked={data.result.silence}
                    onCheckedChange={(checked) => {
                      data.result.silence = checked
                      onChange(data)
                    }}
                  />
                </div>
                <Divider />

                <SettingCollapsible
                  title={t("actions.action_card.rewrite_rules")}
                  onOpenChange={(open) => {
                    if (
                      open &&
                      (!data.result.rewriteRules || data.result.rewriteRules?.length === 0)
                    ) {
                      data.result.rewriteRules = [
                        {
                          from: "",
                          to: "",
                        },
                      ]
                    }
                    onChange(data)
                  }}
                >
                  {data.result.rewriteRules && data.result.rewriteRules.length > 0 && (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead size="sm" />
                          <TableHead size="sm">{t("actions.action_card.from")}</TableHead>
                          <TableHead size="sm">{t("actions.action_card.to")}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.result.rewriteRules.map((rule, rewriteIdx) => {
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
                  )}
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
                </SettingCollapsible>
                <Divider />
                <SettingCollapsible
                  title={t("actions.action_card.block_rules")}
                  onOpenChange={(open) => {
                    if (open && (!data.result.blockRules || data.result.blockRules?.length === 0)) {
                      data.result.blockRules = [{}]
                    }
                    onChange(data)
                  }}
                >
                  {data.result.blockRules && data.result.blockRules.length > 0 && (
                    <Table>
                      <FieldTableHeader />
                      <TableBody>
                        {data.result.blockRules.map((rule, index) => {
                          const change = (key: string, value: string | number) => {
                            data.result.blockRules![index][key] = value
                            onChange(data)
                          }
                          const type =
                            EntryOptions.find((option) => option.value === rule.field)?.type ||
                            "text"
                          return (
                            <TableRow key={index}>
                              <DeleteTableCell
                                disabled={disabled}
                                onClick={() => {
                                  if (data.result.blockRules?.length === 1) {
                                    delete data.result.blockRules
                                  } else {
                                    data.result.blockRules?.splice(index, 1)
                                  }
                                  onChange(data)
                                }}
                              />
                              <TableCell size="sm">
                                <Select
                                  disabled={disabled}
                                  value={rule.field}
                                  onValueChange={(value) => change("field", value)}
                                >
                                  <CommonSelectTrigger />
                                  <SelectContent>
                                    {EntryOptions.map((option) => (
                                      <SelectItem key={option.value} value={option.value}>
                                        {option.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </TableCell>
                              <OperationTableCell
                                disabled={disabled}
                                type={type}
                                value={rule.operator}
                                onValueChange={(value) => change("operator", value)}
                              />
                              <TableCell size="sm">
                                <Input
                                  disabled={disabled}
                                  type={type}
                                  value={rule.value}
                                  className="h-8"
                                  onChange={(e) => change("value", e.target.value)}
                                />
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  )}
                  <AddTableRow
                    disabled={disabled}
                    onClick={() => {
                      if (!data.result.blockRules) {
                        data.result.blockRules = []
                      }
                      data.result.blockRules!.push({})
                      onChange(data)
                    }}
                  />
                </SettingCollapsible>
                <Divider />

                <SettingCollapsible
                  title={t("actions.action_card.webhooks")}
                  onOpenChange={(open) => {
                    if (open && (!data.result.webhooks || data.result.webhooks?.length === 0)) {
                      data.result.webhooks = [""]
                    }
                    onChange(data)
                  }}
                >
                  {data.result.webhooks && data.result.webhooks.length > 0 && (
                    <>
                      {data.result.webhooks.map((webhook, rewriteIdx) => {
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
                    </>
                  )}
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
                </SettingCollapsible>
              </div>
            </div>
          </div>
        </Collapse>
      </CardHeader>
    </Card>
  )
}
