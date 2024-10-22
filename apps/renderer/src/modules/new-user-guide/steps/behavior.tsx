import { useState } from "react"
import { useTranslation } from "react-i18next"

import { setGeneralSetting } from "~/atoms/settings/general"
import { Radio, RadioGroup } from "~/components/ui/radio-group"

type Behavior = "radical" | "balanced" | "conservative"

export function BehaviorGuide() {
  const [value, setValue] = useState<Behavior>("balanced")
  const { t } = useTranslation("app")

  const updateSettings = (behavior: Behavior) => {
    switch (behavior) {
      case "radical": {
        setGeneralSetting("hoverMarkUnread", true)
        setGeneralSetting("scrollMarkUnread", true)
        setGeneralSetting("renderMarkUnread", true)
        break
      }
      case "balanced": {
        setGeneralSetting("hoverMarkUnread", true)
        setGeneralSetting("scrollMarkUnread", true)
        setGeneralSetting("renderMarkUnread", false)
        break
      }
      case "conservative": {
        setGeneralSetting("hoverMarkUnread", false)
        setGeneralSetting("scrollMarkUnread", false)
        setGeneralSetting("renderMarkUnread", false)
        break
      }
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4">
        <RadioGroup
          value={value}
          onValueChange={(value) => {
            setValue(value as Behavior)
            updateSettings(value as Behavior)
          }}
        >
          <Radio
            wrapperClassName="border rounded-lg p-3 has-[:checked]:bg-theme-accent has-[:checked]:text-white transition-colors"
            label={t("new_user_guide.step.behavior.unread_question.option1")}
            value="radical"
          />
          <Radio
            wrapperClassName="border rounded-lg p-3 has-[:checked]:bg-theme-accent has-[:checked]:text-white transition-colors"
            label={t("new_user_guide.step.behavior.unread_question.option2")}
            value="balanced"
          />
          <Radio
            wrapperClassName="border rounded-lg p-3 has-[:checked]:bg-theme-accent has-[:checked]:text-white transition-colors"
            label={t("new_user_guide.step.behavior.unread_question.option3")}
            value="conservative"
          />
        </RadioGroup>
      </div>
    </div>
  )
}
