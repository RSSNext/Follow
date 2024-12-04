import { useTranslation } from "react-i18next"

import { useSubViewTitle } from "~/modules/app-layout/subview/hooks"
import { ActionSetting } from "~/modules/settings/tabs/actions"

export function Component() {
  const { t } = useTranslation()

  useSubViewTitle("words.actions")

  return (
    <div className="relative flex w-full flex-col items-center gap-8 px-4 pb-8 lg:pb-4">
      <div className="pt-12 text-2xl font-bold">{t("words.actions")}</div>
      <ActionSetting />
    </div>
  )
}
