import { actionActions } from "@/src/store/action/store"
import type { ActionId, ActionRule } from "@/src/store/action/types"

export const filterFieldOptions = [
  {
    label: "Subscription View",
    value: "view",
    type: "view",
  },
  {
    label: "Feed Title",
    value: "title",
  },
  {
    label: "Feed Category",
    value: "category",
  },
  {
    label: "Site URL",
    value: "site_url",
  },
  {
    label: "Feed URL",
    value: "feed_url",
  },
  {
    label: "Entry Title",
    value: "entry_title",
  },
  {
    label: "Entry Content",
    value: "entry_content",
  },
  {
    label: "Entry URL",
    value: "entry_url",
  },
  {
    label: "Entry Author",
    value: "entry_author",
  },
  {
    label: "Entry Media Length",
    value: "entry_media_length",
    type: "number",
  },
]

export const filterOperatorOptions = [
  {
    label: "contains",
    value: "contains",
    types: ["text"],
  },
  {
    label: "does not contain",
    value: "not_contains",
    types: ["text"],
  },
  {
    label: "is equal to",
    value: "eq",
    types: ["number", "text", "view"],
  },
  {
    label: "is not equal to",
    value: "not_eq",
    types: ["number", "text", "view"],
  },
  {
    label: "is greater than",
    value: "gt",
    types: ["number"],
  },
  {
    label: "is less than",
    value: "lt",
    types: ["number"],
  },
  {
    label: "matches regex",
    value: "regex",
    types: ["text"],
  },
]

export const availableActionList: Array<{
  value: ActionId
  label: string
  onEnable?: (index: number) => void
  component?: React.FC<{ rule: ActionRule }>
}> = [
  {
    value: "summary",
    label: "Generate summary using AI",
  },
  {
    value: "translation",
    label: "Translate into",
    onEnable: (index) => {
      actionActions.patchRule(index, { result: { translation: "zh-CN" } })
    },
  },
  {
    value: "readability",
    label: "Enable readability",
  },
  {
    value: "sourceContent",
    label: "View source content",
  },
  {
    value: "newEntryNotification",
    label: "Notification of new entry",
  },
  {
    value: "silence",
    label: "Silence",
  },
  {
    value: "block",
    label: "Block",
  },
  {
    value: "rewriteRules",
    label: "Rewrite Rules",
    onEnable: (index: number) => {
      actionActions.patchRule(index, { result: { rewriteRules: [] } })
    },
  },
  {
    value: "webhooks",
    label: "Webhooks",
    onEnable: (index) => {
      actionActions.patchRule(index, { result: { webhooks: [] } })
    },
  },
]
