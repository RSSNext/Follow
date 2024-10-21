import { useState } from "react"
import { useTranslation } from "react-i18next"

import { setGeneralSetting } from "~/atoms/settings/general"
import { Radio, RadioGroup } from "~/components/ui/radio-group"

type Behavior = "default" | "disabled" | ""

export function BehaviorGuide() {
  const [value, setValue] = useState<Behavior>("")
  const { t } = useTranslation("app")

  const updateSettings = (behavior: Behavior) => {
    setGeneralSetting("hoverMarkUnread", behavior === "default")
    setGeneralSetting("scrollMarkUnread", behavior === "default")
  }

  return (
    <div className="space-y-4">
      <h2 className="mb-6 text-xl font-semibold">
        {t("new_user_guide.step.behavior.unread_question.content")}
      </h2>
      <div className="flex flex-col gap-4">
        <RadioGroup
          value={value}
          onValueChange={(value) => {
            setValue(value as Behavior)
            updateSettings(value as Behavior)
          }}
        >
          <Radio
            wrapperClassName="border rounded-lg p-4 has-[:checked]:bg-theme-accent-50 has-[:checked]:text-theme-accent-900 has-[:checked]:border-theme-accent-200"
            label={t("new_user_guide.step.behavior.unread_question.option1")}
            value="default"
          />
          <Radio
            wrapperClassName="border rounded-lg p-4 has-[:checked]:bg-theme-accent-50 has-[:checked]:text-theme-accent-900 has-[:checked]:border-theme-accent-200"
            label={t("new_user_guide.step.behavior.unread_question.option2")}
            value="disabled"
          />
        </RadioGroup>
      </div>
    </div>
  )
}
