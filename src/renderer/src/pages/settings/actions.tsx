import { ActionCard } from "@renderer/components/settings/action-card"
import { SettingsTitle } from "@renderer/components/settings/title"
import { Button } from "@renderer/components/ui/button"
import { useBizQuery } from "@renderer/hooks/useBizQuery"
import { apiClient } from "@renderer/lib/api-fetch"
import { Queries } from "@renderer/queries"
import { useMutation } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { toast } from "sonner"

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
  const actions = useBizQuery(Queries.action.getAll())
  const [actionsData, setActionsData] = useState<ActionsInput>([])

  useEffect(() => {
    if (actions.data?.rules) {
      setActionsData(actions.data.rules)
    }
  }, [actions.data?.rules])

  const mutation = useMutation({
    mutationFn: async () => {
      await apiClient.actions.$put({
        json: {
          rules: actionsData,
        },
      })
    },
    onSuccess: () => {
      Queries.action.getAll().invalidate()
      toast("🎉 Actions saved.")
    },
  })

  return (
    <>
      <SettingsTitle path="actions" className="mb-4" />
      <div className="space-y-4">
        {actionsData.map((action, actionIdx) => (
          <ActionCard
            key={action.name}
            data={action}
            onChange={(newAction) => {
              if (!newAction) {
                setActionsData(actionsData.filter((_, idx) => idx !== actionIdx))
              } else {
                setActionsData(actionsData.map((a, idx) => idx === actionIdx ? newAction : a))
              }
            }}
          />
        ))}
        <Button
          variant="outline"
          size="sm"
          className="w-full gap-1"
          onClick={() => {
            setActionsData([...actionsData, {
              name: `Action ${actionsData.length + 1}`,
              condition: [],
              result: {},
            }])
          }}
        >
          <i className="i-mingcute-add-line" />
          {" "}
          New Rule
        </Button>
        <Button
          isLoading={mutation.isPending}
          onClick={() => mutation.mutate()}
        >
          Save
        </Button>
      </div>
    </>
  )
}
