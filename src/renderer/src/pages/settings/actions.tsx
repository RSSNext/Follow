import { ActionCard } from "@renderer/components/settings/action-card"
import { SettingsTitle } from "@renderer/components/settings/title"
import { Button } from "@renderer/components/ui/button"
import { useState } from "react"

type Operation = "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex"
type EntryField = "all" | "title" | "content" | "author" | "link" | "order"
type FeedField = "view" | "title" | "category" | "site_url" | "feed_url"

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

export function Component() {
  const [testActions, setTestActions] = useState<ActionsInput>([{
    name: "Twitter.com to x.com",
    condition: [{
      field: "view" as const,
      operator: "eq" as const,
      value: 1,
    }, {
      field: "title" as const,
      operator: "contains" as const,
      value: "Twitter",
    }],
    result: {
      translation: "zh-CN",
      summary: true,
      rewriteRules: [{
        from: "twitter.com",
        to: "x.com",
      }],
      blockRules: [{
        field: "content" as const,
        operator: "contains" as const,
        value: "next.js",
      }, {
        field: "author" as const,
        operator: "eq" as const,
        value: "elonmusk",
      }],
    },
  }])

  return (
    <>
      <SettingsTitle path="actions" className="mb-4" />
      <div className="space-y-4">
        {testActions.map((action, actionIdx) => (
          <ActionCard
            key={actionIdx}
            data={action}
            onChange={(newAction) => {
              setTestActions(testActions.map((a, idx) => idx === actionIdx ? newAction : a))
            }}
          />
        ))}
        <Button
          variant="outline"
          size="sm"
          className="w-full gap-1"
          onClick={() => {
            setTestActions([...testActions, {
              name: `Action ${testActions.length + 1}`,
              condition: [],
              result: {},
            }])
          }}
        >
          <i className="i-mingcute-add-line" />
          {" "}
          New Rule
        </Button>
      </div>
    </>
  )
}
