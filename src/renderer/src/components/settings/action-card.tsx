/* eslint-disable tailwindcss/no-custom-classname */
import { Button } from "@renderer/components/ui/button"
import { Card, CardHeader } from "@renderer/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@renderer/components/ui/collapsible"
import { Divider } from "@renderer/components/ui/divider"
import { Input } from "@renderer/components/ui/input"
import { Label } from "@renderer/components/ui/label"
import {
  RadioGroup,
  RadioGroupItem,
} from "@renderer/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@renderer/components/ui/select"
import { Switch } from "@renderer/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@renderer/components/ui/table"

type Operation =
  | "contains"
  | "not_contains"
  | "eq"
  | "not_eq"
  | "gt"
  | "lt"
  | "regex"
type EntryField = "all" | "title" | "content" | "author" | "link" | "order"
type FeedField = "view" | "title" | "category" | "site_url" | "feed_url"

// eslint-disable-next-line unused-imports/no-unused-vars
type Actions = {
  name: string
  condition: {
    field: FeedField
    operator: Operation
    value: string | number
  }[]
  result: {
    translation?: string
    summary?: boolean
    rewriteRules?: {
      from: string
      to: string
    }[]
    blockRules?: {
      field: EntryField
      operator: Operation
      value: string | number
    }[]
  }
}[]

type ActionsInput = {
  name: string
  condition: {
    field?: FeedField
    operator?: Operation
    value?: string | number
  }[]
  result: {
    translation?: string
    summary?: boolean
    rewriteRules?: {
      from: string
      to: string
    }[]
    blockRules?: {
      field?: EntryField
      operator?: Operation
      value?: string | number
    }[]
  }
}[]

const OperationOptions = [
  {
    name: "contains",
    value: "contains",
  },
  {
    name: "does not contain",
    value: "not_contains",
  },
  {
    name: "is equal to",
    value: "eq",
  },
  {
    name: "is not equal to",
    value: "not_eq",
  },
  {
    name: "is greater than",
    value: "gt",
  },
  {
    name: "is less than",
    value: "lt",
  },
  {
    name: "matches regex",
    value: "regex",
  },
]

const EntryOptions = [
  {
    name: "All",
    value: "all",
  },
  {
    name: "Title",
    value: "title",
  },
  {
    name: "Content",
    value: "content",
  },
  {
    name: "Author",
    value: "author",
  },
  {
    name: "Link",
    value: "link",
  },
  {
    name: "Order",
    value: "order",
  },
]

const FeedOptions = [
  {
    name: "View",
    value: "view",
  },
  {
    name: "Title",
    value: "title",
  },
  {
    name: "Category",
    value: "category",
  },
  {
    name: "Site URL",
    value: "site_url",
  },
  {
    name: "Feed URL",
    value: "feed_url",
  },
]

const TransitionOptions = [
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

const FieldTableHeader = () => (
  <TableHeader>
    <TableRow>
      <TableHead size="sm" />
      <TableHead size="sm">Field</TableHead>
      <TableHead size="sm">Operator</TableHead>
      <TableHead size="sm">Value</TableHead>
    </TableRow>
  </TableHeader>
)

const DeleteTableCell = ({
  disabled,
  onClick,
}: {
  disabled?: boolean
  onClick?: () => void
}) => (
  <TableCell size="sm" className="flex h-10 items-center pr-1">
    <Button
      variant="ghost"
      className="w-full px-0"
      size="sm"
      disabled={disabled}
      onClick={onClick}
    >
      <i className="i-mingcute-delete-2-line text-zinc-600" />
    </Button>
  </TableCell>
)

const AddTableRow = ({ onClick }: { onClick?: () => void }) => (
  <Button
    variant="outline"
    size="sm"
    className="mt-1 w-full gap-1"
    onClick={onClick}
  >
    <i className="i-mingcute-add-line" />
    {" "}
    Add
  </Button>
)

const OperationTableCell = ({
  value,
  onValueChange,
}: {
  value?: Operation
  onValueChange?: (value: Operation) => void
}) => (
  <TableCell size="sm">
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="h-8">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {OperationOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </TableCell>
)

const SettingCollapsible = ({
  title,
  children,
  open,
  onOpenChange,
}: {
  title: string
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) => (
  <Collapsible open={open} onOpenChange={onOpenChange}>
    <div className="flex items-center">
      <Label className="flex-1">{title}</Label>
      <CollapsibleTrigger className="-m-3 flex items-center [&_i]:data-[state=open]:rotate-45">
        <i className="i-mingcute-add-line m-3 transition-transform" />
      </CollapsibleTrigger>
    </div>
    <CollapsibleContent className="mt-2">{children}</CollapsibleContent>
  </Collapsible>
)

export function ActionCard({
  data,
  onChange,
}: {
  data: ActionsInput[number]
  onChange: (data: ActionsInput[number] | null) => void
}) {
  return (
    <Card>
      <CardHeader className="space-y-4 px-6 py-4">
        <Collapsible className="[&_.name-placeholder]:data-[state=open]:hidden [&_input.name-input]:data-[state=open]:block">
          <div className="flex w-full items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="-ml-2"
              onClick={() => {
                onChange(null)
              }}
            >
              <i className="i-mingcute-delete-2-line text-zinc-600" />
            </Button>
            <p className="shrink-0 font-medium text-zinc-500">Name</p>
            <Input
              value={data.name}
              className="name-input hidden h-8"
              onChange={(e) => {
                data.name = e.target.value
                onChange(data)
              }}
            />
            <CollapsibleTrigger className="flex w-14 flex-1 shrink-0 items-center pl-3 text-left [&_i]:data-[state=open]:rotate-90">
              <div className="name-placeholder flex-1 text-sm">{data.name}</div>
              <i className="i-mingcute-right-line h-8 shrink-0 text-xl transition-transform" />
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="mt-4 space-y-4">
            <div className="space-y-3">
              <p className="font-medium text-zinc-500">When feeds match…</p>
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
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="all" />
                  <Label htmlFor="all">All followed feeds</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="filter" id="filter" />
                  <Label htmlFor="filter">Custom filter</Label>
                </div>
              </RadioGroup>
              {data.condition.length > 0 && (
                <div>
                  <Table>
                    <FieldTableHeader />
                    <TableBody>
                      {data.condition.map((condition, conditionIdx) => {
                        const change = (
                          key: string,
                          value: string | number,
                        ) => {
                          if (!data.condition[conditionIdx]) {
                            data.condition[conditionIdx] = {}
                          }
                          data.condition[conditionIdx][key] = value
                          onChange(data)
                        }
                        return (
                          <TableRow key={conditionIdx}>
                            <DeleteTableCell
                              onClick={() => {
                                data.condition.splice(conditionIdx, 1)
                                onChange(data)
                              }}
                            />
                            <TableCell size="sm">
                              <Select
                                value={condition.field}
                                onValueChange={(value: FeedField) =>
                                  change("field", value)}
                              >
                                <SelectTrigger className="h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {FeedOptions.map((option) => (
                                    <SelectItem
                                      key={option.value}
                                      value={option.value}
                                    >
                                      {option.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <OperationTableCell
                              value={condition.operator}
                              onValueChange={(value) =>
                                change("operator", value)}
                            />
                            <TableCell size="sm">
                              <Input
                                value={condition.value}
                                className="h-8"
                                onChange={(e) =>
                                  change("value", e.target.value)}
                              />
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                  <AddTableRow
                    onClick={() => {
                      data.condition.push({})
                      onChange(data)
                    }}
                  />
                </div>
              )}
            </div>
            <div className="space-y-4">
              <p className="font-medium text-zinc-500">
                Then the settings are…
              </p>
              <div className="w-full space-y-4">
                <SettingCollapsible
                  title="Translate to"
                  open={!!data.result.translation}
                  onOpenChange={(open) => {
                    if (open) {
                      data.result.translation = TransitionOptions[0].value
                    } else {
                      delete data.result.translation
                    }
                    onChange(data)
                  }}
                >
                  <Select
                    value={data.result.translation}
                    onValueChange={(value) => {
                      data.result.translation = value
                      onChange(data)
                    }}
                  >
                    <SelectTrigger className="h-8 max-w-44">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TransitionOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </SettingCollapsible>
                <Divider />
                <SettingCollapsible
                  title="Enable AI summary"
                  open={data.result.summary !== undefined}
                  onOpenChange={(open) => {
                    if (open) {
                      data.result.summary = true
                    } else {
                      delete data.result.summary
                    }
                    onChange(data)
                  }}
                >
                  <Switch
                    checked={data.result.summary}
                    onCheckedChange={(checked) => {
                      data.result.summary = checked
                      onChange(data)
                    }}
                  />
                </SettingCollapsible>
                <Divider />
                <SettingCollapsible
                  title="Rewrite Rules"
                  open={!!data.result.rewriteRules}
                  onOpenChange={(open) => {
                    if (open) {
                      data.result.rewriteRules = [{
                        from: "",
                        to: "",
                      }]
                    } else {
                      delete data.result.rewriteRules
                    }
                    onChange(data)
                  }}
                >
                  {data.result.rewriteRules && data.result.rewriteRules.length > 0 && (
                    <>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead size="sm" />
                            <TableHead size="sm">From</TableHead>
                            <TableHead size="sm">To</TableHead>
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
                                  onClick={() => {
                                    if (
                                      data.result.rewriteRules?.length === 1
                                    ) {
                                      delete data.result.rewriteRules
                                    } else {
                                      data.result.rewriteRules?.splice(
                                        rewriteIdx,
                                        1,
                                      )
                                    }
                                    onChange(data)
                                  }}
                                />
                                <TableCell size="sm">
                                  <Input
                                    value={rule.from}
                                    className="h-8"
                                    onChange={(e) => change("from", e.target.value)}
                                  />
                                </TableCell>
                                <TableCell size="sm">
                                  <Input
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
                        onClick={() => {
                          data.result.rewriteRules!.push({
                            from: "",
                            to: "",
                          })
                          onChange(data)
                        }}
                      />
                    </>
                  )}
                </SettingCollapsible>
                <Divider />
                <SettingCollapsible
                  title="Block Rules"
                  open={!!data.result.blockRules}
                  onOpenChange={(open) => {
                    if (open) {
                      data.result.blockRules = [{}]
                    } else {
                      delete data.result.blockRules
                    }
                    onChange(data)
                  }}
                >
                  {data.result.blockRules && data.result.blockRules.length > 0 && (
                    <>
                      <Table>
                        <FieldTableHeader />
                        <TableBody>
                          {data.result.blockRules.map((rule, index) => {
                            const change = (
                              key: string,
                              value: string | number,
                            ) => {
                              data.result.blockRules![index][key] = value
                              onChange(data)
                            }
                            return (
                              <TableRow key={index}>
                                <DeleteTableCell
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
                                    value={rule.field}
                                    onValueChange={(value) =>
                                      change("field", value)}
                                  >
                                    <SelectTrigger className="h-8">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {EntryOptions.map((option) => (
                                        <SelectItem
                                          key={option.value}
                                          value={option.value}
                                        >
                                          {option.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </TableCell>
                                <OperationTableCell
                                  value={rule.operator}
                                  onValueChange={(value) => change("operator", value)}
                                />
                                <TableCell size="sm">
                                  <Input
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
                      <AddTableRow
                        onClick={() => {
                          data.result.blockRules!.push({})
                          onChange(data)
                        }}
                      />
                    </>
                  )}
                </SettingCollapsible>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardHeader>
    </Card>
  )
}
