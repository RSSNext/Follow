import { useMutation } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"

import { Button } from "~/components/ui/button"
import { LoadingWithIcon } from "~/components/ui/loading"
import { useAuthQuery } from "~/hooks/common"
import { apiClient } from "~/lib/api-fetch"
import { toastFetchError } from "~/lib/error-parser"
import type { ActionsInput, ActionsResponse } from "~/models"
import { ActionCard } from "~/modules/settings/action-card"
import { SettingsTitle } from "~/modules/settings/title"
import { defineSettingPageData } from "~/modules/settings/utils"
import { Queries } from "~/queries"

const iconName = "i-mgc-magic-2-cute-re"
const priority = 1020

export const loader = defineSettingPageData({
  iconName,
  name: "titles.actions",
  priority,
})

export function Component() {
  const { t } = useTranslation("settings")
  const actions = useAuthQuery(Queries.action.getAll())
  const [actionsData, setActionsData] = useState<ActionsInput>([])

  useEffect(() => {
    if (actions.data?.rules) {
      setActionsData(actions.data.rules)
    }
  }, [actions.data?.rules])

  const mutation = useMutation({
    mutationFn: async () => {
      actionsData.forEach((action) => {
        action.condition = action.condition.filter((c) => c.field && c.operator && c.value)
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
      toast(t("actions.saveSuccess"))
    },
    onError: (error) => {
      toastFetchError(error)
    },
  })

  if (actions.isPending) {
    return (
      <div className="center absolute inset-0 flex">
        <LoadingWithIcon
          icon={<i className={iconName} />}
          size="large"
          className="-translate-y-full"
        />
      </div>
    )
  }

  return (
    <>
      <SettingsTitle />
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
          <Button
            variant="primary"
            isLoading={mutation.isPending}
            onClick={() => mutation.mutate()}
          >
            {t("actions.save")}
          </Button>
        </div>
      </div>
    </>
  )
}
