import { Button } from "@follow/components/ui/button/index.js"
import { LoadingWithIcon } from "@follow/components/ui/loading/index.jsx"
import type { ActionsInput, ActionsResponse } from "@follow/models/types"
import { useMutation } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"

import { useAuthQuery } from "~/hooks/common"
import { apiClient } from "~/lib/api-fetch"
import { toastFetchError } from "~/lib/error-parser"
import { queryClient } from "~/lib/query-client"
import { ActionCard } from "~/modules/settings/action-card"
import { Queries } from "~/queries"

export const ActionSetting = () => {
  const { t } = useTranslation("settings")
  const actions = useAuthQuery(Queries.action.getAll())
  const [actionsData, setActionsData] = useState<ActionsInput>([])

  useEffect(() => {
    if (actions.data?.rules) {
      setActionsData(
        actions.data.rules.map((rule) => {
          const { condition } = rule
          // fix old data
          const finalCondition =
            condition.length === 0 || Array.isArray(condition[0]) ? condition : [condition]

          return {
            ...rule,
            condition: finalCondition as any,
          }
        }),
      )
    }
  }, [actions.data?.rules])

  const mutation = useMutation({
    mutationFn: async () => {
      actionsData.forEach((action) => {
        action.condition = action.condition
          .map((condition) => {
            return condition.filter((c) => c.field && c.operator && c.value)
          })
          .filter((c) => c.length > 0)
        action.result.rewriteRules = action.result.rewriteRules?.filter((r) => r.from && r.to)
        action.result.blockRules = action.result.blockRules?.filter(
          (r) => r.field && r.operator && r.value,
        )
        action.result.webhooks = action.result.webhooks?.filter((w) => w)
      })
      await apiClient.actions.$put({
        json: {
          rules: actionsData as ActionsResponse,
        },
      })
    },
    onSuccess: () => {
      Queries.action.getAll().invalidate()
      queryClient.invalidateQueries({
        queryKey: ["entries"],
      })
      toast(t("actions.saveSuccess"))
    },
    onError: (error) => {
      toastFetchError(error)
    },
  })

  if (actions.isPending) {
    return (
      <div className="center flex lg:absolute lg:inset-0">
        <LoadingWithIcon
          icon={<i className="i-mgc-magic-2-cute-re" />}
          size="large"
          className="lg:-translate-y-full"
        />
      </div>
    )
  }

  return (
    <div className="mt-4 space-y-4">
      {actionsData.map((action, actionIdx) => (
        <ActionCard
          key={actionIdx}
          data={action}
          onChange={(newAction) => {
            if (!newAction) {
              setActionsData(actionsData.filter((_, idx) => idx !== actionIdx))
            } else {
              setActionsData(actionsData.map((a, idx) => (idx === actionIdx ? newAction : a)))
            }
          }}
        />
      ))}
      <Button
        variant="outline"
        className="center w-full gap-1"
        onClick={() => {
          setActionsData([
            ...actionsData,
            {
              name: t("actions.actionName", { number: actionsData.length + 1 }),
              condition: [],
              result: {},
            },
          ])
        }}
      >
        <i className="i-mgc-add-cute-re" />
        <span>{t("actions.newRule")}</span>
      </Button>
      <div className="text-right">
        <Button variant="primary" isLoading={mutation.isPending} onClick={() => mutation.mutate()}>
          {t("actions.save")}
        </Button>
      </div>
    </div>
  )
}
