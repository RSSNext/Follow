import { StyledButton } from "@renderer/components/ui/button"
import { useBizQuery } from "@renderer/hooks"
import { apiClient } from "@renderer/lib/api-fetch"
import type { ActionsResponse } from "@renderer/models"
import { ActionCard } from "@renderer/modules/settings/action-card"
import { SettingsTitle } from "@renderer/modules/settings/title"
import { defineSettingPage } from "@renderer/modules/settings/utils"
import { Queries } from "@renderer/queries"
import { useMutation } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { toast } from "sonner"

const iconName = "i-mgc-magic-2-cute-re"
const name = "Actions"
const priority = 1020

export const loader = defineSettingPage({
  iconName,
  name,
  priority,
})

type Operation =
  | "contains"
  | "not_contains"
  | "eq"
  | "not_eq"
  | "gt"
  | "lt"
  | "regex"
type EntryField = "all" | "title" | "content" | "author" | "url" | "order"
type FeedField = "view" | "title" | "site_url" | "feed_url"

type ActionsInput = {
  name: string
  condition: {
    field?: FeedField
    operator?: Operation
    value?: string
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
      actionsData.forEach((action) => {
        action.condition = action.condition.filter(
          (c) => c.field && c.operator && c.value,
        )
        action.result.rewriteRules = action.result.rewriteRules?.filter(
          (r) => r.from && r.to,
        )
        action.result.blockRules = action.result.blockRules?.filter(
          (r) => r.field && r.operator && r.value,
        )
      })
      await apiClient.actions.$put({
        json: {
          rules: actionsData as ActionsResponse,
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
      <SettingsTitle />
      <div className="space-y-4">
        {actionsData.map((action, actionIdx) => (
          <ActionCard
            key={actionIdx}
            data={action}
            onChange={(newAction) => {
              if (!newAction) {
                setActionsData(
                  actionsData.filter((_, idx) => idx !== actionIdx),
                )
              } else {
                setActionsData(
                  actionsData.map((a, idx) =>
                    idx === actionIdx ? newAction : a,
                  ),
                )
              }
            }}
          />
        ))}
        <StyledButton
          variant="plain"
          className="center w-full gap-1"
          onClick={() => {
            setActionsData([
              ...actionsData,
              {
                name: `Action ${actionsData.length + 1}`,
                condition: [],
                result: {},
              },
            ])
          }}
        >
          <i className="i-mgc-add-cute-re" />
          <span> New Rule</span>
        </StyledButton>
        <div className="text-right">
          <StyledButton
            variant="primary"
            isLoading={mutation.isPending}
            onClick={() => mutation.mutate()}
          >
            Save
          </StyledButton>
        </div>
      </div>
    </>
  )
}
