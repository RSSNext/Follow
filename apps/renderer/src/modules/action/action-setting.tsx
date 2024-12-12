import { Button } from "@follow/components/ui/button/index.js"
import { LoadingWithIcon } from "@follow/components/ui/loading/index.jsx"
import { useMutation } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"

import { toastFetchError } from "~/lib/error-parser"
import { queryClient } from "~/lib/query-client"
import { ActionCard } from "~/modules/action/action-card"
import { useActionsQuery } from "~/queries/actions"
import { actionActions, useActions, useIsActionDataDirty } from "~/store/action"

export const ActionSetting = () => {
  const actionQuery = useActionsQuery()
  const actionLength = useActions((actions) => actions.length)

  if (actionQuery.isPending) {
    return <LoadingWithIcon icon={<i className="i-mgc-magic-2-cute-re" />} size="large" />
  }

  return (
    <div className="w-full max-w-4xl space-y-4">
      {Array.from({ length: actionLength }).map((_action, actionIdx) => (
        <ActionCard key={actionIdx} index={actionIdx} />
      ))}
      <ActionSettingOperations />
    </div>
  )
}

function ActionSettingOperations() {
  const { t } = useTranslation("settings")

  const actionLength = useActions((actions) => actions.length)
  const isDirty = useIsActionDataDirty()

  const mutation = useMutation({
    mutationFn: () => actionActions.updateRemoteActions(),
    onSuccess: () => {
      // apply new action settings
      queryClient.invalidateQueries({
        queryKey: ["entries"],
      })
      toast(t("actions.saveSuccess"))
    },
    onError: (error) => {
      toastFetchError(error)
    },
  })

  return (
    <>
      <Button
        variant="outline"
        className="center w-full gap-1"
        onClick={() => {
          actionActions.insertNewEmptyAction(t("actions.actionName", { number: actionLength + 1 }))
        }}
      >
        <i className="i-mgc-add-cute-re" />
        <span>{t("actions.newRule")}</span>
      </Button>
      <div className="text-right">
        <Button
          variant="primary"
          disabled={!isDirty}
          isLoading={mutation.isPending}
          onClick={() => mutation.mutate()}
        >
          {t("actions.save")}
        </Button>
      </div>
    </>
  )
}
