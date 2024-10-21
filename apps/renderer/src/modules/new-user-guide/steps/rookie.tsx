import { useTranslation } from "react-i18next"

import { Radio, RadioGroup } from "~/components/ui/radio-group"

import { useHaveUsedOtherRSSReaderAtom } from "../atoms"

export function RookieCheck() {
  const [value, setValue] = useHaveUsedOtherRSSReaderAtom()
  const { t } = useTranslation("app")

  return (
    <div className="space-y-4">
      <h2 className="mb-6 text-xl font-semibold">
        {t("new_user_guide.step.start_question.content")}
      </h2>
      <div className="flex flex-col gap-4">
        <RadioGroup
          value={value ? "yes" : "no"}
          onValueChange={(value) => {
            setValue(value === "yes")
          }}
        >
          <Radio
            wrapperClassName="border rounded-lg p-4 has-[:checked]:bg-theme-accent-50 has-[:checked]:text-theme-accent-900 has-[:checked]:border-theme-accent-200"
            label={t("new_user_guide.step.start_question.option1")}
            value="yes"
          />
          <Radio
            wrapperClassName="border rounded-lg p-4 has-[:checked]:bg-theme-accent-50 has-[:checked]:text-theme-accent-900 has-[:checked]:border-theme-accent-200"
            label={t("new_user_guide.step.start_question.option2")}
            value="no"
          />
        </RadioGroup>
      </div>
    </div>
  )
}
